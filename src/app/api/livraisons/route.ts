import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all livraisons
export async function GET() {
  try {
    console.log("Fetching all livraisons...");

    const livraisons = await prisma.livraison.findMany({
      include: {
        user: true,
        commande: true,
        panier: true,
      },
    });

    if (livraisons.length === 0) {
      return NextResponse.json({ message: 'No livraisons found' }, { status: 404 });
    }

    console.log("GET API/livraisons: livraisons found:", livraisons);
    return NextResponse.json(livraisons, { status: 200 });
  } catch (error) {
    console.error('Error fetching livraisons:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
