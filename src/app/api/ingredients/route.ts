import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Définition du type pour un ingrédient
interface Ingredient {
  name: string;
  description: string;
  prix: number;
  categorie: string;
}

export async function GET() {
  try {
    console.log("Fetching all ingredients...");

    const ingredients = await prisma.ingredient.findMany();

    if (!ingredients || ingredients.length === 0) {
      console.error("No ingredients found");
      return NextResponse.json({ message: 'No ingredients found' }, { status: 404 });
    }

    console.log("GET API/ingredients: ingredients found:", ingredients);
    return NextResponse.json(ingredients);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching ingredients:", error.message);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    console.error("Unknown error fetching ingredients:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Ingredient = await req.json();
    const { name, description, prix, categorie } = body;

    if (!name || !prix || !description || !categorie) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating ingredient with body:', body);    

    const matchIngredient = await prisma.ingredient.findFirst({ where: { name } });
    if (matchIngredient) {
      console.error('Ingredient already exists:', matchIngredient);
      return NextResponse.json(matchIngredient, { status: 201 }); 
    }
    
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
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating ingredient:", error.message);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    console.error("Unknown error creating ingredient:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
