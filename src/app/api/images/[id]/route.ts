import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère une image par son ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
    }

    return NextResponse.json(image, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’image :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Met à jour le chemin d'une image par son ID
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: 'Le chemin de l’image est requis' }, { status: 400 });
    }

    const existingImage = await prisma.image.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
    }

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(id, 10) },
      data: { path },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’image :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Supprime une image par son ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  try {
    await prisma.image.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Image supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’image :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
