import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handler pour PUT
export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;

  try {
    const { quantity, sessionId, userId } = await req.json();

    console.log('PUT api/cart/[productId]:', { productId, quantity, sessionId, userId });

    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
    }

    // Trouver le panier correspondant
    const panier = await prisma.panier.findFirst({
      where: {
        fk_userId: userId ? parseInt(userId, 10) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!panier) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
    }

    // Vérifier si l'enregistrement existe
    const existingItem = await prisma.quantitePanier.findUnique({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Produit non trouvé dans le panier' }, { status: 404 });
    }

    // Mettre à jour la quantité
    const updatedItem = await prisma.quantitePanier.update({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
      data: {
        quantite: quantity,
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit dans le panier :', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

// Handler pour DELETE
export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const { sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);

  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
  }

  console.log('DELETE API/cart/[productId]:', { productId, sessionId, userId });

  try {
    const paniers = await prisma.panier.findMany({
      where: {
        fk_userId: userId ? parseInt(userId) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!paniers || paniers.length === 0) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
    }

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
