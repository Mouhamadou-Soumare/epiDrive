import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const { quantity, sessionId, userId } = await req.json();

  console.log('PUT API/cart/[productId]:', { productId, quantity, sessionId, userId });
  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
  }

  const panier = await prisma.panier.findFirst({
    where: {
      fk_userId: userId ? parseInt(userId) : undefined,
      sessionId: sessionId ?? undefined,
    },
  });

  if (!panier) {
    return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
  }

  const item = await prisma.quantitePanier.update({
    where: {
      fk_panier_fk_produit: {
        fk_panier: panier.id,
        fk_produit: parseInt(productId),
      },
    },
    data: {
      quantite: quantity,
    },
  });

  return NextResponse.json(item, { status: 200 });
}
  
export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  // Vérification des paramètres
  const { productId } = params;
  const { sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);

  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
  }

  console.log('DELETE API/cart/[productId]:', { productId, sessionId, userId });

  try {
    // Récupérer tous les paniers correspondants
    const paniers = await prisma.panier.findMany({
      where: {
        fk_userId: userId ? parseInt(userId) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!paniers || paniers.length === 0) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
    }

    // Supprimer les produits du panier pour chaque panier trouvé
    for (const panier of paniers) {
      await prisma.quantitePanier.deleteMany({
        where: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId),
        },
      });
    }

    return NextResponse.json({ message: 'Produit supprimé du panier' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json({ error: 'Erreur interne lors de la suppression du produit' }, { status: 500 });
  }
}
