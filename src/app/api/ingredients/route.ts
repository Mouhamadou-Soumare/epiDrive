import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Ingredient {
  name: string;
  description: string;
  prix: number;
  categorie: string;
}

/**
 * Récupère tous les ingrédients
 */
export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();

    if (!ingredients.length) {
      return NextResponse.json(
        { message: "Aucun ingrédient trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des ingrédients :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Crée un nouvel ingrédient
 */
export async function POST(req: Request) {
  try {
    const { name, description, prix, categorie }: Ingredient = await req.json();

    if (!name || !prix || !description || !categorie) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const existingIngredient = await prisma.ingredient.findFirst({
      where: { name },
    });

    if (existingIngredient) {
      return NextResponse.json(existingIngredient, { status: 201 });
    }

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        description,
        prix: parseFloat(prix.toString()),
        categorie,
      },
    });

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l’ingrédient :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
