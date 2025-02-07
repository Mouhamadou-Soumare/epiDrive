import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const { quantity, sessionId, userId } = await req.json();

  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
  }

  try {
    // Récupérer le panier de l'utilisateur ou de la session
    const panier = await prisma.panier.findFirst({
      where: {
        fk_userId: userId ? parseInt(userId, 10) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!panier) {
      return NextResponse.json({ error: "Panier non trouvé" }, { status: 404 });
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = await prisma.quantitePanier.findUnique({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Produit non trouvé dans le panier" }, { status: 404 });
    }

    // Mettre à jour la quantité
    const updatedItem = await prisma.quantitePanier.update({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
      data: { quantite: quantity },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit dans le panier :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// Handler pour DELETE
export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const { sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);

  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
  }

  console.log("DELETE API/cart/[productId]:", { productId, sessionId, userId });

  try {
    const panier = await prisma.panier.findFirst({
      where: {
        fk_userId: userId ? parseInt(userId, 10) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!panier) {
      return NextResponse.json({ error: "Panier non trouvé" }, { status: 404 });
    }

    await prisma.quantitePanier.delete({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
    });

    return NextResponse.json({ message: "Produit supprimé du panier" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return NextResponse.json({ error: "Erreur interne lors de la suppression du produit" }, { status: 500 });
  }
}

