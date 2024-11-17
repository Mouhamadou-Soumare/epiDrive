import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
    const { productId, quantity, sessionId, userId } = await req.json();
  
    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: 'Paramètres requis manquants' }, { status: 400 });
    }
  
    const produit = await prisma.produit.findUnique({ where: { id: productId } });
    if (!produit) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
  
    const panier = await prisma.panier.upsert({
      where: {
        userId: userId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
      create: {
        userId,
        sessionId,
      },
      update: {},
    });
  
    const item = await prisma.quantitePanier.upsert({
      where: {
        panierId_produitId: { panierId: panier.id, produitId: productId }, 
      },
      create: {
        produitId: productId,
        panierId: panier.id,
        quantite: quantity,
        prix: produit.prix,
      },
      update: {
        quantite: { increment: quantity },
      },
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
        userId: userId ? parseInt(userId) : undefined,
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
