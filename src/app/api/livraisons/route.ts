import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère toutes les livraisons
 */
export async function GET() {
  try {
    const livraisons = await prisma.livraison.findMany({
      include: {
        user: true,
        commande: true,
        panier: true,
      },
    });

    if (!livraisons.length) {
      return NextResponse.json({ message: 'Aucune livraison trouvée' }, { status: 404 });
    }

    return NextResponse.json(livraisons, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
