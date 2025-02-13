import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CommandeStatus, Livraison_Type } from '@prisma/client';

interface ProduitCommande {
  id: number;
  quantite: number;
  prix: number;
  image?: string;
}

interface CommandeBody {
  status: CommandeStatus;
  paymentId?: string;
  userId: string;
  infosAdresse: {
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  produits: ProduitCommande[];
  type: Livraison_Type;
}

/**
 * Récupère toutes les commandes avec leurs quantités et informations de livraison
 */
export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
      include: {
        quantites: true,
        livraison: true,
      },
    });

    if (!commandes.length) {
      return NextResponse.json({ message: 'Aucune commande trouvée' }, { status: 404 });
    }

    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    console.error(' Erreur lors de la récupération des commandes :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Crée une nouvelle commande avec les informations de livraison et les produits associés
 */
export async function POST(req: Request) {
  try {
    const body: CommandeBody = await req.json();
    const { status, paymentId, userId, infosAdresse, produits, type } = body;

    if (!status || !userId || !infosAdresse || !produits.length || !type) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    if (!infosAdresse.adresse || !infosAdresse.ville || !infosAdresse.codePostal || !infosAdresse.pays) {
      return NextResponse.json({ error: 'Champs adresse invalides' }, { status: 400 });
    }

    if (!Object.values(CommandeStatus).includes(status)) {
      return NextResponse.json({ error: `Statut invalide : ${status}` }, { status: 400 });
    }

    if (!Object.values(Livraison_Type).includes(type)) {
      return NextResponse.json({ error: `Type de livraison invalide : ${type}` }, { status: 400 });
    }

    const livraisonData = {
      adresse: infosAdresse.adresse,
      ville: infosAdresse.ville,
      codePostal: infosAdresse.codePostal,
      pays: infosAdresse.pays,
    };

    // Création de la commande
    const newCommande = await prisma.commande.create({
      data: {
        status,
        paymentId: paymentId || null,
        user: { connect: { id: parseInt(userId, 10) } },
        type,
      },
    });

    // Vérification d'une adresse de livraison existante pour l'utilisateur
    let livraison = await prisma.livraison.findFirst({
      where: {
        ...livraisonData,
        fk_userId: parseInt(userId, 10),
      },
    });

    // Création de la livraison si inexistante
    if (!livraison) {
      livraison = await prisma.livraison.create({
        data: {
          ...livraisonData,
          user: { connect: { id: parseInt(userId, 10) } },
        },
      });
    }

    // Association de la livraison à la commande
    await prisma.commande.update({
      where: { id: newCommande.id },
      data: { livraison: { connect: { id: livraison.id } } },
    });

    // Ajout des produits à la commande
    for (const produit of produits) {
      if (!produit.id || produit.quantite <= 0) {
        return NextResponse.json({ error: 'Données produit invalides', produit }, { status: 400 });
      }

      await prisma.quantiteCommande.create({
        data: {
          commande: { connect: { id: newCommande.id } },
          produit: { connect: { id: produit.id } },
          quantite: produit.quantite,
          prix: produit.prix,
        },
      });
      
      // Mise à jour du stock du produit
      await prisma.produit.update({
        where: { id: produit.id },
        data: {
          stock: {
            decrement: produit.quantite,
          },
        },
      });
    }

    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error(' Erreur lors de la création de la commande :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: (error as Error).message },
      { status: 500 }
    );
  }
}