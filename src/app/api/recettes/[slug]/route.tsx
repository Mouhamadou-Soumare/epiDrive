import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit, Ingredient } from 'types';

import { promises as fs } from "fs";
import path from "path";

// GET a specific recette by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const recette = await prisma.recette.findUnique({
      where: { id: parseInt(slug) },
      include: {
        user: true,
        produits: true,
        ingredients: true,
      },
    });

    if (!recette) {
      return NextResponse.json({ error: 'Recette not found' }, { status: 404 });
    }

    const transformedRecette = {
      id: recette.id,
      title: recette.title,
      description: recette.description,
      instructions: recette.instructions,
      image: recette.image || '/img/placeholder.webp',
      user: { id: recette.user.id, username: recette.user.username },
      produits: recette.produits.map((produit: Produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
        stock: produit.stock,
      })),
      ingredients: recette.ingredients.map((ingredient: Ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
      })),
    };

    console.log("GET API/recettes/" + slug + ": recette found:", transformedRecette);
    return NextResponse.json(transformedRecette);
  } catch (error) {
    console.error("Error fetching recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// PATCH : Mettre à jour une recette
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

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

    const existingRecette = await prisma.recette.findUnique({ where: { id: parseInt(slug) } });

    if (!existingRecette) {
      return NextResponse.json({ error: "Recette non trouvée" }, { status: 404 });
    }

    let imagePath = existingRecette.image;

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

    const updatedRecette = await prisma.recette.update({
      where: { id: parseInt(slug) },
      data: {
        title,
        description,
        instructions,
        image: imagePath,
        user: { connect: { id: userId } },
        produits: { set: produits.map((id: number) => ({ id })) },
      },
    });

    return NextResponse.json(updatedRecette);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la recette :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


// DELETE : Supprimer une recette
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await prisma.recette.delete({
      where: { id: parseInt(slug) },
    });

    console.log('DELETE API/recettes/' + slug + ': recette deleted');
    return NextResponse.json({ message: 'Recette deleted successfully' });
  } catch (error) {
    console.error("Error deleting recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
