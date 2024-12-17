import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Vérifier si le paramètre slug est présent
  if (!slug) {
    return NextResponse.json({ error: 'Le paramètre slug est requis.' }, { status: 400 });
  }

  // Vérifier si le slug est un entier valide
  const userId = parseInt(slug);
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: 'Le format du slug est invalide. Un nombre entier est requis.' },
      { status: 400 }
    );
  }

  try {
    console.log('Recherche de l’utilisateur avec ID :', userId);

    // Requête Prisma pour récupérer l'utilisateur avec les relations associées
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        image: true,
        commandes: {
          include: {
            quantites: {
              include: {
                produit: true,
              },
            },
          },
        },
      },
    });

    // Si aucun utilisateur n'est trouvé
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération de l’utilisateur :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
