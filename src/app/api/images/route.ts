import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère toutes les images
 */
export async function GET() {
  try {
    const images = await prisma.image.findMany();

    if (!images.length) {
      return NextResponse.json({ message: 'Aucune image trouvée' }, { status: 404 });
    }

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des images :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Ajoute une nouvelle image
 */
export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: 'Le chemin de l’image est requis' }, { status: 400 });
    }

    const newImage = await prisma.image.create({ data: { path } });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l’image :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
