import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(req: NextRequest, { params }) {
    const { productId } = params;
    const { quantity, sessionId, userId } = await req.json();
  
    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
    }
  
    const panier = await prisma.panier.findFirst({
      where: {
        userId: userId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
    });
  
    if (!panier) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
    }
  
    const item = await prisma.quantitePanier.update({
      where: {
        panierId_produitId: { panierId: panier.id, produitId: parseInt(productId) },
      },
      data: {
        quantite: quantity,
      },
    });
  
    return NextResponse.json(item, { status: 200 });
  }
  
  export async function DELETE(req: NextRequest, { params }) {
    const { productId } = params;
    const { sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);
  
    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
    }
  
    const panier = await prisma.panier.findFirst({
      where: {
        userId: userId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
    });
  
    if (!panier) {
      return NextResponse.json({ error: 'Panier non trouvé' }, { status: 404 });
    }
  
    await prisma.quantitePanier.deleteMany({
      where: {
        panierId: panier.id,
        produitId: parseInt(productId),
      },
    });
  
    return NextResponse.json({ message: 'Produit supprimé du panier' }, { status: 200 });
  }
  