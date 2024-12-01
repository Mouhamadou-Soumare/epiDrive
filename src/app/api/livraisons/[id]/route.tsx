import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific livraison by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const livraisonId = parseInt(id);
  if (isNaN(livraisonId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    console.log("Fetching livraison with ID:", livraisonId);

    const livraison = await prisma.livraison.findUnique({
      where: { id: livraisonId },
      include: {
        user: true,
        commande: true,
        panier: true,
      },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison not found' }, { status: 404 });
    }

    console.log('GET API/livraisons/' + id + ': livraison found:', livraison);
    return NextResponse.json(livraison, { status: 200 });
  } catch (error) {
    console.error('Error fetching livraison:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a specific livraison by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const livraisonId = parseInt(id);
  if (isNaN(livraisonId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    console.log('Deleting livraison with ID:', livraisonId);

    const livraison = await prisma.livraison.findUnique({
      where: { id: livraisonId },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison not found' }, { status: 404 });
    }

    await prisma.livraison.delete({
      where: { id: livraisonId },
    });

    console.log('DELETE API/livraisons/' + id + ': livraison deleted');
    return NextResponse.json({ message: 'Livraison deleted successfully' });
  } catch (error) {
    console.error('Error deleting livraison:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
