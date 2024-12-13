import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Ingredient } from 'types';

export async function GET() {
  try {
    console.log("Fetching all ingredients...");

    // Vérifiez si le modèle existe avec une requête simple
    const ingredients = await prisma.ingredient.findMany();

    if (!ingredients || ingredients.length === 0) {
      console.error("No ingredients found");
      return NextResponse.json({ message: 'No ingredients found' }, { status: 404 });
    }

    console.log("GET API/ingredients: ingredients found:", ingredients);
    return NextResponse.json(ingredients);
  } catch (error: any) {
    console.error("Error fetching ingredients:", error.message || error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, prix, categorie } = body;

    if (!name || !prix || !description || !categorie) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating ingredient with body:', body);    

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        description,
        prix: parseFloat(prix.toString()),
        categorie,
      },
    });
    
    console.log('POST API/ingredients: ingredient created:', newIngredient);
    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error: any) {
    console.error("Error deleting ingredient:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
