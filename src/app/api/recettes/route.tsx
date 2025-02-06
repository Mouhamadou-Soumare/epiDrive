import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit, Ingredient } from 'types';

// Définition du type de Recette
interface Recette {
  id: number;
  title: string;
  description: string;
  instructions: string;
  image?: string;
  user: { id: number; username: string } | null;
  produits: Produit[];
  ingredients: Ingredient[];
}

export async function GET() {
  try {
    console.log("Fetching all recettes...");

    const recettes = await prisma.recette.findMany({
      include: {
        user: true,
        produits: {
          include: {
            categorie: true, // Assurez-vous que la catégorie est incluse si nécessaire
          },
        },
        ingredients: true,
      },
    });

    if (recettes.length === 0) {
      console.log("No recettes found");
      return NextResponse.json({ message: 'No recettes found' }, { status: 404 });
    }

    const transformedRecettes: Recette[] = recettes.map((recette) => ({
      id: recette.id,
      title: recette.title,
      description: recette.description,
      instructions: recette.instructions,
      image: recette.image || '/img/placeholder.webp',
      user: recette.user ? { id: recette.user.id, username: recette.user.username } : null,
      produits: recette.produits.map((produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
        description: produit.description || "Aucune description", // Valeur par défaut
        categorieId: produit.categorie ? produit.categorie.id : null, // Vérification de la catégorie
      })),
      ingredients: recette.ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description || "Pas de description", // ✅ Correction ici
        prix: ingredient.prix || 0, // ✅ Correction ici
        categorie: ingredient.categorie || "Sans catégorie", // ✅ Correction ici
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

    const checkExistingRecette = await prisma.recette.findFirst({ where: { title } });

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
          ? { connect: produits.map((produit: { id: number }) => ({ id: produit.id })) }
          : undefined,
        ingredients: ingredients
          ? { connect: ingredients.map((ingredient: { id: number }) => ({ id: ingredient.id })) }
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
