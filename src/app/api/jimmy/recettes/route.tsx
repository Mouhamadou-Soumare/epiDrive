import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import prisma from '@/lib/prisma';

import { Ingredient } from "types";

// Fonction de normalisation pour améliorer la détection des recettes existantes
function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

// Fonction de distance de Levenshtein
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Suppression
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + 1 // Remplacement
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

export async function POST(req: NextRequest) {
  try {
    const { panier } = await req.json();
    const API_KEY = process.env.CHATGPT_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    if (!Array.isArray(panier) || panier.length === 0) {
      return NextResponse.json({ error: "Invalid or empty panier" }, { status: 400 });
    }

    const ingredientsList: string[] = panier.map((item: { produit: Ingredient }) => item.produit?.name).filter(Boolean);

    if (ingredientsList.length === 0) {
      return NextResponse.json({ error: "No valid ingredients found in panier" }, { status: 400 });
    }

    console.log("🔍 Recherche de recettes avec les ingrédients :", ingredientsList);

    // 🔹 Requête OpenAI pour générer les recettes
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant utile pour générer des recettes. Respectez scrupuleusement le schéma donné.",
          },
          {
            role: "user",
            content: `Créez 3 recettes en français qui doivent contenir les ingrédients suivants :
            ${ingredientsList.map((ingredient) => `- ${ingredient}`).join("\n")}.
            Ajoutez d'autres ingrédients si nécessaire.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "plat",
            strict: true,
            schema: {
              type: "object",
              properties: {
                recipes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      instructions: { type: "string" },
                      image: { type: "string" },
                      ingredients: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            description: { type: "string" },
                            prix: { type: "number" },
                            categorie: { type: "string" },
                          },
                          required: ["name", "description", "prix", "categorie"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["title", "description", "instructions", "image", "ingredients"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["recipes"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur API OpenAI:", errorData);
      return NextResponse.json({ error: errorData.error || "Erreur OpenAI" }, { status: response.status });
    }

    const data = await response.json();
    const recipes = JSON.parse(data.choices[0]?.message?.content)?.recipes;
    let db_recipes = [];

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ error: "Aucune recette générée" }, { status: 404 });
    }

    const allRecipes = await prisma.recette.findMany({ 
      select: { id: true, title: true, ingredients: true, produits: true }
    }
    );

    for (const recipe of recipes) {
      const normalizedTitle = normalizeString(recipe.title);

      // 🔍 Vérification si la recette existe déjà
      let existingRecipe = allRecipes.find(r => normalizeString(r.title) === normalizedTitle);

      // Si aucune correspondance exacte, vérifier avec Levenshtein
      if (!existingRecipe) {
        let closestMatch = null;
        let minDistance = Infinity;
        for (const r of allRecipes) {
          const distance = levenshteinDistance(normalizedTitle, normalizeString(r.title));
          if (distance < minDistance && distance <= 5) { // Seuil ajustable
            minDistance = distance;
            closestMatch = r;
          }
        }
        if (closestMatch) {
          const foundRecipe = await prisma.recette.findUnique({ 
            where: { id: closestMatch.id }, 
            include: { ingredients: true, produits: true }
           });
        
          if (foundRecipe) {
            existingRecipe = foundRecipe;
          }
        }        
      }

      if (existingRecipe) {
        console.log(`✅ Recette existante trouvée: ${existingRecipe.title}`);
        db_recipes.push(existingRecipe);
        continue;
      }

      console.log(`🆕 Création d'une nouvelle recette: ${recipe.title}`);

      // 📌 Gestion des ingrédients et produits
      let ingredientsToAdd = [];
      let productsToAdd = [];

      for (const ingredient of recipe.ingredients) {
        const normalizedIngredientName = normalizeString(ingredient.name);

        let produitRecord = await prisma.produit.findFirst({
          where: { name: normalizedIngredientName },
        });

        if (produitRecord) {
          productsToAdd.push({ id: produitRecord.id });
          continue;
        }

        let ingredientRecord = await prisma.ingredient.findFirst({
          where: { name: normalizedIngredientName },
        });

        if (!ingredientRecord) {
          ingredientRecord = await prisma.ingredient.create({
            data: {
              name: ingredient.name,
              description: ingredient.description,
              prix: ingredient.prix,
              categorie: ingredient.categorie,
            },
          });
        }

        ingredientsToAdd.push({ id: ingredientRecord.id });
      }

      // 📌 Création de la recette
      const newRecipe = await prisma.recette.create({
        data: {
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          image: recipe.image,
          fk_userId: 1,
          ingredients: { connect: ingredientsToAdd },
          produits: { connect: productsToAdd },
        }, include: { ingredients: true, produits: true },
      });

      console.log(`✅ Nouvelle recette créée: ${newRecipe.title}`);
      db_recipes.push(newRecipe);
    }

    console.log("🍽 Recettes générées avec succès", db_recipes);
    return NextResponse.json({ recipes: db_recipes });

  } catch (error) {
    console.error("❌ Erreur lors de la génération des recettes:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
