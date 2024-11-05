import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("Received slug:", slug);   

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Searching for commande with slug:", slug);

    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
      include: {
        user: true,
        quantites: {
          include: {
            produit: true,
          },
        },
      },
    });

    if (!commande) {
      return NextResponse.json({ error: 'Commande not found' }, { status: 404 });
    }

    return NextResponse.json(commande);
  } catch (error) {
    console.error("Error fetching commande:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { status, paymentId, userId } = data;

  try {
    console.log("Updating commande with slug:", slug);
    const existingCommande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
    });

    if (!existingCommande) {
      return NextResponse.json({ error: 'Commande not found' }, { status: 404 });
    }

    const updatedCommande = await prisma.commande.update({
      where: { id: parseInt(slug) },
      data: {
        status,
        paymentId,
        userId,
      },
    });

    return NextResponse.json(updatedCommande);
  } catch (error: any) {
    console.error("Error updating commande:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
    });

    if (!commande) {
      return NextResponse.json({ error: 'Commande not found' }, { status: 404 });
    }

    await prisma.commande.delete({
      where: { id: parseInt(slug) },
    });

    return NextResponse.json({ message: 'Commande deleted successfully' });
  } catch (error) {
    console.error("Error deleting commande:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
