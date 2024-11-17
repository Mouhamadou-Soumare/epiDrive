import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '../../../../lib/prisma';
import { Recette } from '../../types';

export async function GET() {
  try {
    console.log("Fetching all recipes...");

    const recipes = await prisma.recette.findMany({
      include: {
        user: true,
      },
    });

    console.log("Recipes found:", recipes);

    if (recipes.length === 0) {
      return NextResponse.json({ message: 'No recipes found' }, { status: 404 });
    }

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let data: Omit<Recette, 'id'>; 

  try {
    data = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, description, instructions, produits } = data;

  // Vérification des champs requis
  if (!title || !description || !instructions) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Transformation des produits si nécessaire
    let transformedProduits;
    if (produits) {
      transformedProduits = produits.map((produit) => ({
        id: produit.id,
      }));
    }

    console.log('Creating new recette with products:', produits);

    // Création de la nouvelle recette
    const newRecette = await prisma.recette.create({
      data: {
        title,
        description,
        instructions,
        user: { connect: { id: 1 } }, // Connexion à l'utilisateur existant
        produits: produits ? { connect: produits.map((produit) => ({ id: produit.id })) } : undefined,
        image: null, // Ajustez cette partie si l'image est gérée différemment
      },
    });

    return NextResponse.json(newRecette, { status: 201 });
  } catch (error: any) {
    console.error("Error creating recette:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
