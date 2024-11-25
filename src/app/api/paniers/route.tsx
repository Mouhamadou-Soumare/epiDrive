import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Panier } from 'types';

export async function GET() {
  try {
    console.log("Fetching all paniers...");

    const paniers = await prisma.panier.findMany({
      include: {
        user: true,
        produits: {
          include: {
            produit: true,
          },
        },
      },
    });

    if (paniers.length === 0) {
      console.log("No paniers found");
      return NextResponse.json({ message: 'No paniers found' }, { status: 404 });
    }

    const formattedPaniers = paniers.map((panier: Panier) => ({
      id: panier.id,
      sessionId: panier.sessionId,
      user: panier.user
        ? { id: panier.user.id, username: panier.user.username }
        : null,
      produits: panier.produits.map(quantitePanier => ({
        produitId: quantitePanier.produit.id,
        name: quantitePanier.produit.name,
        quantite: quantitePanier.quantite,
        prix: quantitePanier.prix,
      })),
    }));

    console.log("GET API/paniers: paniers found:", formattedPaniers);
    return NextResponse.json(formattedPaniers, { status: 200 });
  } catch (error) {
    console.error('Error fetching paniers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, sessionId, produits } = body;

    if (!produits || produits.length === 0) {
      return NextResponse.json({ error: 'Products are required' }, { status: 400 });
    }

    const panierData = {
      sessionId: sessionId || undefined,
      user: userId ? { connect: { id: userId } } : undefined,
      produits: {
        create: produits.map((produit: {produitId: number, quantite: number, prix: number}) => ({
          produit: { connect: { id: produit.produitId } },
          quantite: produit.quantite,
          prix: produit.prix,
        })),
      },
    };

    const newPanier = await prisma.panier.create({
      data: panierData,
      include: {
        produits: true,
      },
    });

    console.log("POST API/paniers/: created panier:", newPanier);
    return NextResponse.json(newPanier, { status: 201 });
  } catch (error) {
    console.error('Error creating panier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
