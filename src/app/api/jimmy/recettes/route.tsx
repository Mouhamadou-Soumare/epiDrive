import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import prisma from '@/lib/prisma';

import { Ingredient, Recette } from "types";

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

    console.log("Recherche de recettes avec les ingrédients :", ingredientsList);

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
${ingredientsList.map((ingredient) => `- ${ingredient}`).join("\n")}
FN'hésitez pas à ajouter d'autres ingrédients si nécessaire.`,
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
      console.error("Erreur API OpenAI:", errorData);
      return NextResponse.json({ error: errorData.error || "Erreur lors de la requête à OpenAI" }, { status: response.status });
    }

    const data = await response.json();

    const recipes = data.choices[0]?.message?.content
    let db_recipes = [];
    
    for (const recipe of JSON.parse(recipes).recipes) {
      const checkExistingRecipe = await prisma.recette.findFirst({
        where: { title: recipe.title },
        include: {
          produits: true,
          ingredients: true,
        },
      });

      if (checkExistingRecipe) {
        db_recipes.push(checkExistingRecipe);
        continue;
      }

      const newRecette = await prisma.recette.create({
        data: {
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          image: recipe.image,
          fk_userId: 1
        },
      });

      for (const ingredient of recipe.ingredients) {
        let produitRecord = await prisma.produit.findFirst({
          where: { name: ingredient.name },
        });

        if (produitRecord) {
          await prisma.recette.update({
            where: { id: newRecette.id },
            data: {
              produits: {
                connect: { id: produitRecord.id },
              },
            },
          });
          
          continue;
        }
        
        let ingredientRecord = await prisma.ingredient.findFirst({
          where: { name: ingredient.name },
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

        await prisma.recette.update({
          where: { id: newRecette.id },
          data: {
            ingredients: {
              connect: { id: ingredientRecord.id },
            },
          },
        });
      }

      const finalRecette = await prisma.recette.findFirst({
        where: { id: newRecette.id },
        include: {
          produits: true,
          ingredients: true,
        },
      });

      console.log("Recette ajoutée à la base de données:", finalRecette);

      if (finalRecette) {
        db_recipes.push(finalRecette);
      }
    }

    if (!recipes) {
      return NextResponse.json({ error: "Aucune recette générée" }, { status: 404 });
    }

    console.log("Recettes générées par l'API OpenAI:", db_recipes);
    return NextResponse.json({ recipes: db_recipes });
  } catch (error) {
    console.error("Erreur lors de la génération des recettes:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Erreur interne lors de la génération des recettes" }, { status: 500 });
  }
}
