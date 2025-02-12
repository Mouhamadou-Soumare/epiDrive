import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit, Ingredient } from 'types';

import { promises as fs } from "fs";
import path from "path";

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
        stock: produit.stock,
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
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const instructions = formData.get("instructions") as string;
    const userId = parseInt(formData.get("userId") as string, 10);
    const produits = formData.get("produits") ? JSON.parse(formData.get("produits") as string) : [];
    const newImage = formData.get("newImage") as File | null;

    if (!title || !description || !instructions || !userId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    let imagePath = `/img/recette/default.webp`;

    if (newImage) {
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/img/recette");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      imagePath = `/img/recette/${fileName}`;
    }

    const newRecette = await prisma.recette.create({
      data: {
        title,
        description,
        instructions,
        image: imagePath,
        user: { connect: { id: userId } },
        produits: { connect: produits.map((id: number) => ({ id })) },
      },
    });

    return NextResponse.json(newRecette, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la recette :", error);
    return NextResponse.json({ error: "Échec de la création de la recette" }, { status: 500 });
  }
}

