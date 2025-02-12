import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import prisma from '@/lib/prisma';

/**
 * Normalise une chaîne de caractères (mise en minuscule & suppression des espaces)
 */
const normalizeString = (str: string): string => str.toLowerCase().trim();

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 */
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
    }
  }
  return matrix[a.length][b.length];
};

/**
 * 🔍 Recherche une recette existante en base de données
 */
const findExistingRecipe = async (title: string) => {
  const normalizedTitle = normalizeString(title);
  const allRecipes = await prisma.recette.findMany({ select: { id: true, title: true } });

  let closestMatch = null;
  let minDistance = Infinity;
  
  for (const recipe of allRecipes) {
    const distance = levenshteinDistance(normalizedTitle, normalizeString(recipe.title));
    if (distance < minDistance && distance <= 5) { 
      minDistance = distance;
      closestMatch = recipe;
    }
  }

  return closestMatch ? await prisma.recette.findUnique({
    where: { id: closestMatch.id },
    include: { user: true, produits: true, ingredients: true },
  }) : null;
};

/**
 * 🔎 Recherche ou crée des ingrédients/produits
 */
const processIngredients = async (detectedIngredients: any[]) => {
  const allIngredients = await prisma.ingredient.findMany({ select: { id: true, name: true } });
  const allProducts = await prisma.produit.findMany({ select: { id: true, name: true } });

  let ingredientsToAdd = [];
  let productsToAdd = [];

  for (const ingredient of detectedIngredients) {
    const detectedName = normalizeString(ingredient.name);
    
    let bestMatchIngredient = null;
    let bestMatchProduct = null;
    let minIngDistance = Infinity;
    let minProdDistance = Infinity;

    for (const ing of allIngredients) {
      const distance = levenshteinDistance(detectedName, normalizeString(ing.name));
      if (distance < minIngDistance && distance <= 3) { 
        minIngDistance = distance;
        bestMatchIngredient = ing;
      }
    }

    for (const prod of allProducts) {
      const distance = levenshteinDistance(detectedName, normalizeString(prod.name));
      if (distance < minProdDistance && distance <= 3) { 
        minProdDistance = distance;
        bestMatchProduct = prod;
      }
    }

    if (bestMatchProduct) {
      productsToAdd.push({ id: bestMatchProduct.id });
    } else if (bestMatchIngredient) {
      ingredientsToAdd.push({ id: bestMatchIngredient.id });
    } else {
      const newIngredient = await prisma.ingredient.create({
        data: {
          name: ingredient.name,
          description: ingredient.description,
          prix: ingredient.prix,
          categorie: ingredient.categorie,
        }
      });
      ingredientsToAdd.push({ id: newIngredient.id });
    }
  }

  return { ingredientsToAdd, productsToAdd };
};

/**
 * 🔥 Génère une recette à partir d'une image via OpenAI
 */
export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const API_KEY = process.env.CHATGPT_API_KEY;
    
    if (!API_KEY) return NextResponse.json({ error: "API key is missing" }, { status: 500 });

    console.log("Analyse de l'image en cours...");
    
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "Vous êtes un assistant expert en analyse de recettes." },
          {
            role: 'user',
            content: [
              { type: "text", text: "Analyse cette image et extrait la recette complète avec ingrédients détaillés." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "plat",
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

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Erreur OpenAI" }, { status: response.status });
    }

    const detectedRecipe = JSON.parse((await response.json()).choices[0]?.message?.content);
    if (!detectedRecipe) return NextResponse.json({ error: "Aucune recette détectée" }, { status: 404 });

    console.log("🔍 Recette détectée :", detectedRecipe.title);

    let existingRecipe = await findExistingRecipe(detectedRecipe.title);
    if (existingRecipe) {
      return NextResponse.json({ message: "Recette déjà existante", dish: existingRecipe });
    }

    const { ingredientsToAdd, productsToAdd } = await processIngredients(detectedRecipe.ingredients);

    const newRecipe = await prisma.recette.create({
      data: {
        title: detectedRecipe.title,
        description: detectedRecipe.description,
        instructions: detectedRecipe.instructions,
        image: detectedRecipe.image,
        user: { connect: { id: 1 } },
        ingredients: { connect: ingredientsToAdd },
        produits: { connect: productsToAdd },
      },
      include: { ingredients: true, produits: true },
    });

    console.log("Nouvelle recette créée :", newRecipe.title);
    return NextResponse.json({ message: "Nouvelle recette créée", dish: newRecipe });

  } catch (error) {
    console.error(" Erreur lors de l'analyse :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
