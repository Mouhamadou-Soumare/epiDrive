import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { Recette } from '../../../types';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Id is required' }, { status: 400 });
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

    return NextResponse.json(recette);
  } catch (error) {
    console.error("Error fetching recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  let data: Recette;
  try {
    data = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, description, instructions, userId, produits } = data;

  try {
    console.log('products:', produits);
    console.log("Updating recette with id:", slug);
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
        userId,
        produits: produits ? { set: produits } : undefined
      },
    });

    return NextResponse.json(updatedRecette);
  } catch (error: any) {
    console.error("Error updating recette:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  try {
    await prisma.recette.delete({
      where: { id: parseInt(slug) },
    });

    return NextResponse.json({ message: 'Recette deleted successfully' });
  } catch (error) {
    console.error("Error deleting recette:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
