import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CommandeStatus, Livraison_Type } from '@prisma/client'; 

// Définition du type pour les produits reçus dans la commande
interface ProduitCommande {
  id: number;
  quantite: number;
  prix: number;
  image?: string;
}

// Définition du type pour le corps de la requête
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

    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    console.error('Error fetching commandes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: CommandeBody = await req.json();
    const { status, paymentId, userId, infosAdresse, produits, type } = body;

    console.log('Creating commande with body:', body);

    // Vérification des champs requis
    if (!status || !userId || !infosAdresse || !produits || !type || produits.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!infosAdresse.adresse || !infosAdresse.ville || !infosAdresse.codePostal || !infosAdresse.pays) {
      return NextResponse.json({ error: 'Invalid adresse fields' }, { status: 400 });
    }

    // ✅ Vérifier que `status` est une valeur valide de `CommandeStatus`
    if (!Object.values(CommandeStatus).includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    // ✅ Vérifier que `type` est une valeur valide de `Livraison_Type`
    if (!Object.values(Livraison_Type).includes(type)) {
      return NextResponse.json({ error: `Invalid type: ${type}` }, { status: 400 });
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
        status, // ✅ Plus d'erreur, car `status` est du bon type
        paymentId: paymentId || null,
        user: { connect: { id: parseInt(userId, 10) } }, // Conversion de l'id en Int
        type
      },
    });

    const existingLivraison = await prisma.livraison.findFirst({
      where: {
        ...livraisonData,
        fk_userId: parseInt(userId, 10),
      },
    });

    if (existingLivraison) {
      await prisma.commande.update({
        where: { id: newCommande.id },
        data: { livraison: { connect: { id: existingLivraison.id } } },
      });
    } else {
      const newLivraison = await prisma.livraison.create({
        data: {
          ...livraisonData,
          user: { connect: { id: parseInt(userId, 10) } },
        },
      });

      await prisma.commande.update({
        where: { id: newCommande.id },
        data: { livraison: { connect: { id: newLivraison.id } } },
      });
    }
    
    // Ajout des produits à la commande
    for (const produit of produits) {
      if (!produit.id || !produit.quantite || produit.quantite <= 0) {
        return NextResponse.json({ error: 'Invalid produit data', produit }, { status: 400 });
      }

      // Définit une image par défaut si elle n'est pas fournie
      const imagePath = produit.image || '/img/default-placeholder.webp';

      await prisma.quantiteCommande.create({
        data: {
          commande: { connect: { id: newCommande.id } },
          produit: { connect: { id: produit.id } },
          quantite: produit.quantite,
          prix: produit.prix,
        },
      });

      console.log("Produit ajouté avec image :", imagePath);
    }

    console.log('Commande created:', newCommande);
    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error('Error creating commande:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
