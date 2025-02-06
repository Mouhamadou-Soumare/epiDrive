import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import prisma from '@/lib/prisma';

// Fonction de comparaison (Levenshtein)
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
    const { image } = await req.json();
    const API_KEY = process.env.CHATGPT_API_KEY;

    if (!API_KEY) {
      throw new Error('API key is missing');
    }

    console.log('Analyse de l\'image en cours...');

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // 🔹 Analyse de l'image avec OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant utile pour l'analyse des recettes."
          },
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: 'Donne moi le nom, la description, les instructions et l\'image de la recette ainsi que la liste des ingrédients pour la recette suivante (chaque ingrédient doit avoir un name, une description, un prix, une categorie) :'
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: 'plat',
            strict: true,
            schema: {
              type: "object",
              properties: {
                ingredients: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      prix: { type: "number" },
                      categorie: { type: "string" }
                    },
                    required: ["name", "description", "prix", "categorie"],
                    additionalProperties: false
                  }
                },
                title: { type: "string" },
                description: { type: "string" },
                instructions: { type: "string" },
                image: { type: "string" }
              },
              required: ["ingredients", "title", "description", "instructions", "image"],
              additionalProperties: false
            }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Erreur lors de la requête à OpenAI' }, { status: response.status });
    }

    console.log('Analyse de l\'image terminée');

    const content = data.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'Aucune recette trouvée' }, { status: 404 });
    }

    console.log('Recette détectée :', content);

    const detectedRecipe = JSON.parse(content);
    const detectedTitle = detectedRecipe.title.toLowerCase().trim();

    console.log('Titre de la recette :', detectedTitle);
    // 🔍 Vérification si la recette existe déjà
    const allRecipes = await prisma.recette.findMany({ select: { id: true, title: true } });

    let closestMatch = null;
    let minDistance = Infinity;
    for (const recipe of allRecipes) {
      const distance = levenshteinDistance(detectedTitle, recipe.title.toLowerCase().trim());
      console.log('Distance avec', detectedTitle, ' vs ', recipe.title);
      if (distance < minDistance && distance <= 5) { // 🔹 Seuil de tolérance pour les recettes
        minDistance = distance;
        closestMatch = recipe;
      }
    }

    if (closestMatch) {
      console.log(`🔍 Recette existante trouvée : ${closestMatch.title} (distance ${minDistance})`);
      const existingRecipe = await prisma.recette.findUnique({
        where: { id: closestMatch.id },
        include: { user: true, produits: true, ingredients: true },
      });

      return NextResponse.json({
        message: "Recette déjà existante",
        dish: existingRecipe,
      });
    }

    console.log('Nouvelle recette détectée');
    // 🔍 Vérification des ingrédients et produits existants avec `levenshteinDistance`
    const allIngredients = await prisma.ingredient.findMany({ select: { id: true, name: true } });
    const allProducts = await prisma.produit.findMany({ select: { id: true, name: true } });

    const ingredientsToAdd = [];
    const productsToAdd = [];

    for (const detectedIngredient of detectedRecipe.ingredients) {
      console.log('Ingrédient détecté :', detectedIngredient.name);
      const detectedName = detectedIngredient.name.toLowerCase().trim();
      let bestMatchIngredient = null;
      let bestMatchProduct = null;
      let minIngDistance = Infinity;
      let minProdDistance = Infinity;

      // 🔍 Comparer avec les ingrédients existants
      for (const ing of allIngredients) {
        const distance = levenshteinDistance(detectedName, ing.name.toLowerCase().trim());
        if (distance < minIngDistance && distance <= 3) { // 🔹 Seuil ajustable pour les ingrédients
          minIngDistance = distance;
          bestMatchIngredient = ing;
        }
      }

      // 🔍 Comparer avec les produits existants
      for (const prod of allProducts) {
        const distance = levenshteinDistance(detectedName, prod.name.toLowerCase().trim());
        if (distance < minProdDistance && distance <= 3) { // 🔹 Seuil ajustable pour les produits
          minProdDistance = distance;
          bestMatchProduct = prod;
        }
      }

      if (bestMatchProduct) {
        console.log(`✅ Produit trouvé : ${bestMatchProduct.name} (distance ${minProdDistance})`);
        productsToAdd.push({ id: bestMatchProduct.id });
      } else if (bestMatchIngredient) {
        console.log(`✅ Ingrédient trouvé : ${bestMatchIngredient.name} (distance ${minIngDistance})`);
        ingredientsToAdd.push({ id: bestMatchIngredient.id });
      } else {
        console.log(`🆕 Nouvel ingrédient ajouté : ${detectedIngredient.name}`);
        const newIngredient = await prisma.ingredient.create({
          data: {
            name: detectedIngredient.name,
            description: detectedIngredient.description,
            prix: detectedIngredient.prix,
            categorie: detectedIngredient.categorie,
          }
        });
        ingredientsToAdd.push({ id: newIngredient.id });
      }
    }

    // 📌 Création de la recette avec les bons ingrédients et produits
    const newRecipe = await prisma.recette.create({
      data: {
        title: detectedRecipe.title,
        description: detectedRecipe.description,
        instructions: detectedRecipe.instructions,
        image: detectedRecipe.image,
        user: { connect: { id: 1 } }, // 🔹 Remplace par l'ID utilisateur dynamique si nécessaire
        ingredients: {
          connect: ingredientsToAdd, // 🔗 Associe les ingrédients existants et créés
        },
        produits: {
          connect: productsToAdd, // 🔗 Associe les produits existants
        }
      },
      include: {
        ingredients: true,
        produits: true,
      }
    });

    console.log('Nouvelle recette créée :', newRecipe.title);

    return NextResponse.json({
      message: "Nouvelle recette créée",
      dish: newRecipe,
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse de l\'image:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'analyse de l\'image' }, { status: 500 });
  }
}
