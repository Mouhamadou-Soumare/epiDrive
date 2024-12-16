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

    // Vérification des champs requis
    if (!status || !userId || !infosAdresse || !produits || produits.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!infosAdresse.adresse || !infosAdresse.ville || !infosAdresse.codePostal || !infosAdresse.pays) {
      return NextResponse.json({ error: 'Invalid adresse fields' }, { status: 400 });
    }

    const livraisonData = {
      adresse: infosAdresse.adresse,
      ville: infosAdresse.ville,
      codePostal: infosAdresse.codePostal,
      pays: infosAdresse.pays,
    };

    // Création de la commande avec l'adresse de livraison
    const newCommande = await prisma.commande.create({
      data: {
        status,
        paymentId: paymentId || null,
        user: { connect: { id: userId } },
        livraison: { create: livraisonData },
      },
    });

    // Ajout des produits à la commande
    for (const produit of produits) {
      if (!produit.id || !produit.quantite) {
        return NextResponse.json({ error: 'Invalid produit data' }, { status: 400 });
      }

      await prisma.quantiteCommande.create({
        data: {
          commande: { connect: { id: newCommande.id } },
          produit: { connect: { id: produit.id } },
          quantite: produit.quantite,
          prix: produit.prix, // Assuming 'prix' is a property of 'produit'
        },
      });
    }

    console.log('Commande created:', newCommande);
    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error('Error creating commande:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
}

