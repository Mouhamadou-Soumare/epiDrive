import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit } from 'types';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const recette = await prisma.recette.findUnique({
      where: { id: parseInt(slug) },
      include: {
        user: true,
        produits: true,
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
      produits: recette.produits.map((produit : Produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
      })),
    };

    console.log("GET API/recettes/" + slug + ": recette found:", transformedRecette);
    return NextResponse.json(transformedRecette);
  } catch (error) {
    console.error("Error fetching recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const body = await request.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { title, description, instructions, userId, produits, path } = body;

  if (!title || !description || !instructions || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const existingRecette = await prisma.recette.findUnique({
      where: { id: parseInt(slug) },
    });

    if (!existingRecette) {
      return NextResponse.json({ error: 'Recette not found' }, { status: 404 });
    }

    const updatedRecette = await prisma.recette.update({
      where: { id: parseInt(slug) },
      data: {
        title,
        description,
        instructions,
        user: { connect: { id: userId } },
        produits: {
          set: [],
          connect: produits.map((produit: Produit) => ({ id: produit.id })),
        },
        image: path,
      },
      include: {
        user: true,
        produits: true,
      },
    });

    const transformedRecette = {
      id: updatedRecette.id,
      title: updatedRecette.title,
      description: updatedRecette.description,
      instructions: updatedRecette.instructions,
      image: updatedRecette.image || '/img/placeholder.webp',
      user:{ id: updatedRecette.user.id, username: updatedRecette.user.username },
      produits: updatedRecette.produits.map((produit: Produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
      })),
    };

    return NextResponse.json(transformedRecette);
  } catch (error) {
    console.error("Error updating recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

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
