import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        subcategories: { 
          select: {
            id: true,
            name: true,
            slug: true,
            subcategories: { 
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
