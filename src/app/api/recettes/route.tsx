import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit, Recette, Ingredient } from 'types';

export async function GET() {
  try {
    console.log("Fetching all recettes...");

    const recettes = await prisma.recette.findMany({
      include: {
        user: true,
        produits: true,
        ingredients: true,
      },
    });

    if (recettes.length === 0) {
      console.log("No recettes found");
      return NextResponse.json({ message: 'No recettes found' }, { status: 404 });
    }

    // Transformation des données pour un format adapté
    const transformedRecettes = recettes.map((recette: any) => ({
      id: recette.id,
      title: recette.title,
      description: recette.description,
      instructions: recette.instructions,
      image: recette.image || '/img/placeholder.webp',
      user: recette.user ?
        { id: recette.user.id, username: recette.user.username } :
        { id: 0, username: 'Utilisateur inconnu' },
      produits: recette.produits.map((produit: Produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
      })),
      ingredients: recette.ingredients.map((ingredient: Ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
      })),
    }));

    console.log("GET API/recettes: recettes found:", transformedRecettes);
    return NextResponse.json(transformedRecettes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recettes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Creating new recette with body:', body);

    const { title, description, instructions, user, produits, ingredients } = body;

    if (!title || !description || !instructions || !user) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const image = `/img/recette/${title.toLowerCase().replace(/ /g, '-')}.webp`;

    const checkExistingRecette = await prisma.recette.findFirst({
      where: { title },
    });

    if (checkExistingRecette) {
      console.log("Recette already exists");
      return NextResponse.json(checkExistingRecette, { status: 201 });
    }
    const newRecette = await prisma.recette.create({
      data: {
        title,
        description,
        instructions,
        image,
        user: { connect: { id: user.id } },
        produits: produits
          ? { connect: produits.map((produit: Produit) => ({ id: produit.id })) }
          : undefined,
        ingredients: ingredients 
        ? { connect: ingredients.map((ingredient: Ingredient) => ({ id: ingredient.id })) }
        : undefined,
      },
    });

    console.log("POST API/recettes/ : ", newRecette);
    return NextResponse.json(newRecette, { status: 201 });
  } catch (error) {
    console.error("Error creating recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
