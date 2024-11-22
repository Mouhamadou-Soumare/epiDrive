import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("Fetching all commandes...");

    const commandes = await prisma.commande.findMany({
      include: {
        quantites: true,
        livraison: true,
      },
    });

    if (commandes.length === 0) {
      console.error("No commandes found");
      return NextResponse.json({ message: 'No commandes found' }, { status: 404 });
    }

    console.log("GET API/commande: commande found:", commandes);
    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    console.error('Error fetching commandes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status, paymentId, userId, infosAdresse, produits } = body;

    console.log('Creating commande with body:', body);
    if (!status || !userId || !infosAdresse || !produits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const livraisonData = {
      adresse: infosAdresse.adresse,
      ville: infosAdresse.ville,
      codePostal: infosAdresse.codePostal,
      pays: infosAdresse.pays,
      user: {
        connect: { id: userId },
      },
    };

    const newCommande = await prisma.commande.create({
      data: {
        status: status,
        paymentId: paymentId || null,
        user: { connect: { id: userId } },
        livraison: {
          create: livraisonData
        }
      }
    });

    for (const produit of produits) {
      await prisma.quantiteCommande.create({
        data: {
          commande : { connect: { id: newCommande.id } },
          produit: { connect: { id: produit.produit.id } },
          quantite: produit.quantite,
          prix: produit.produit.prix
        }
      });
    }

    console.log('Commande created:', newCommande);
    return NextResponse.json(newCommande, { status: 201 });

  } catch (error) {
    console.error('Error creating commande:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
