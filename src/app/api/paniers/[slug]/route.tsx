import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { QuantitePanier } from 'types';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log(params)
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const panier = await prisma.panier.findUnique({
      where: { id: parseInt(slug) },
      include: {
        user: true,
        produits: {
          include: {
            produit: true,
          },
        },
      },
    });

    if (!panier) {
      return NextResponse.json({ error: 'Panier not found' }, { status: 404 });
    }

    const formattedPanier = {
      id: panier.id,
      sessionId: panier.sessionId,
      user: panier.user
        ? { id: panier.user.id, username: panier.user.username }
        : null,
      produits: panier.produits.map((quantitePanier: QuantitePanier) => ({
        produitId: quantitePanier.produit.id,
        name: quantitePanier.produit.name,
        quantite: quantitePanier.quantite,
        prix: quantitePanier.prix,
      })),
    };

    console.log("GET API/paniers/" + slug + ": panier found:", formattedPanier);
    return NextResponse.json(formattedPanier, { status: 200 });
  } catch (error) {
    console.error('Error fetching panier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const body = await req.json();

  const { produits } = body;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!produits || produits.length === 0) {
    return NextResponse.json({ error: 'Products are required' }, { status: 400 });
  }

  try {
    const panier = await prisma.panier.findUnique({
      where: { id: parseInt(slug) },
      include: { produits: true },
    });

    if (!panier) {
      return NextResponse.json({ error: 'Panier not found' }, { status: 404 });
    }

    // Delete old products
    await prisma.quantitePanier.deleteMany({
      where: { fk_panier: panier.id },
    });

    // Add new products
    for (const produit of produits) {
      await prisma.quantitePanier.create({
      data: {
        panier: { connect: { id: panier.id } },
        produit: { connect: { id: produit.produitId } },
        quantite: produit.quantite,
        prix: produit.prix,
      },
      });
    }

    console.log("PATCH API/paniers/" + slug + ": panier updated");
    return NextResponse.json({ message: 'Panier updated successfully' });
  } catch (error) {
    console.error('Error updating panier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await prisma.panier.delete({
      where: { id: parseInt(slug) },
    });

    console.log("DELETE API/paniers/" + slug + ": panier deleted");
    return NextResponse.json({ message: 'Panier deleted successfully' });
  } catch (error) {
    console.error('Error deleting panier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
