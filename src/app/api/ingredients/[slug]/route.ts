import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Awaiting params before extracting slug

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Fetching ingredient with slug:", slug);

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(slug) },
    });

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    console.log("GET API/ingredients/" + slug + ": Ingredient found:", ingredient);
    return NextResponse.json(ingredient, { status: 200 });
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Deleting ingredient with slug:", slug);

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(slug) },
    });

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    // Proceed with deletion logic
    await prisma.ingredient.delete({ where: { id: parseInt(slug) } });
    console.log('DELETE API/ingredients/' + slug + ': Ingredient deleted');
    return NextResponse.json({ message: 'Ingredient deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
