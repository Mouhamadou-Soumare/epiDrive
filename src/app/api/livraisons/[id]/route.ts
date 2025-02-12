import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère une livraison par son ID
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const livraisonId = parseInt(id, 10);

    if (isNaN(livraisonId)) {
      return NextResponse.json({ error: 'Format ID invalide' }, { status: 400 });
    }

    const livraison = await prisma.livraison.findUnique({
      where: { id: livraisonId },
      include: {
        user: true,
        commande: true,
        panier: true,
      },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison introuvable' }, { status: 404 });
    }

    return NextResponse.json(livraison);
  } catch (error) {
    console.error("Erreur lors de la récupération de la livraison :", error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Supprime une livraison par son ID
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const livraisonId = parseInt(id, 10);

    if (isNaN(livraisonId)) {
      return NextResponse.json({ error: 'Format ID invalide' }, { status: 400 });
    }

    const livraison = await prisma.livraison.findUnique({
      where: { id: livraisonId },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison introuvable' }, { status: 404 });
    }

    await prisma.livraison.delete({
      where: { id: livraisonId },
    });

    return NextResponse.json({ message: 'Livraison supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la livraison :", error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
