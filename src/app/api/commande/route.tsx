import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

import { Commande } from '../../types';

export async function GET() {
  try {
    console.log("Fetching all commandes...");

    const commandes = await prisma.commande.findMany({
      include: {
        user: true,
        quantites: true,
      },
    });

    console.log("Commandes found:", commandes);

    if (commandes.length === 0) {
      return NextResponse.json({ message: 'No commandes found' }, { status: 404 });
    }

    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    console.error('Error fetching commandes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Commande = await request.json();
    const { status, paymentId, userId } = body;

    console.log('Received body:', body);
    if (!status || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if ('id' in body) {
      delete body.id;
    }

    console.log('Creating commande with body:', body);
    const newCommande = await prisma.commande.create({
      data: {
        status: status,
        paymentId: paymentId || null,
        userId: userId,
      },
    });

    console.log('Commande created:', newCommande);

    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error('Error creating commande:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
