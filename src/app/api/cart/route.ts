import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { productId, quantity, sessionId, userId, update } = await req.json();

  if (!productId || (!sessionId && !userId)) {
    return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
  }

  const produit = await prisma.produit.findUnique({ where: { id: productId } });
  if (!produit) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  const panier = await prisma.panier.upsert({
    where: {
      fk_userId: userId ?? undefined,
      sessionId: sessionId ?? undefined,
    },
    create: {
      fk_userId: userId ?? undefined,
      sessionId: sessionId ?? undefined,
    },
    update: {},
  });

  const item = await prisma.quantitePanier.upsert({
    where: {
      fk_panier_fk_produit: {
        fk_panier: panier.id,
        fk_produit: productId,
      },
    },
    create: {
      fk_produit: productId,
      fk_panier: panier.id,
      quantite: quantity,
      prix: produit.prix,
    },
    update: update
      ? { quantite: quantity } // Remplace la quantité si `update` est `true`
      : { quantite: { increment: quantity } }, // Sinon, incrémente
  });

  return NextResponse.json(item, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);

  if (!sessionId && !userId) {
    return NextResponse.json({ error: 'Identifiant de session ou utilisateur requis' }, { status: 400 });
  }

  const panier = await prisma.panier.findFirst({
    where: {
      fk_userId: userId ? parseInt(userId) : undefined,
      sessionId: sessionId ?? undefined,
    },
    include: {
      produits: {
        include: {
          produit: {
            select: { id: true, name: true, prix: true, description: true, image: true },
          },
        },
      },
    },
  });

  return NextResponse.json(panier?.produits || []);
}
