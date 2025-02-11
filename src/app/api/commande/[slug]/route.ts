import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  console.log("Received slug:", slug);   

  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  try {
    console.log("Searching for commande with id:", slug);

    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
      include: {
        quantites: {
          include: {
            produit: true,
          },
        },
        livraison: true
      },
    });

    if (!commande) return NextResponse.json({ error: 'Commande not found' }, { status: 404 });

    return NextResponse.json(commande);
  } catch (error : unknown) {
    console.error("Error fetching commande:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const data = await req.json();
    const { slug } = await params; // Attendre la résolution de params

    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const { status, livraison } = data;

    console.log("Updating commande with slug:", slug);

    // Vérifie si la commande existe
    const existingCommande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
      include: { livraison: true }, // Inclut les informations de livraison
    });

    if (!existingCommande) {
      return NextResponse.json({ error: 'Commande not found' }, { status: 404 });
    }

    // Mise à jour de la commande
    const updatedCommande = await prisma.commande.update({
      where: { id: parseInt(slug) },
      data: {
        status
      },
    });

    // Mise à jour des informations de livraison
    if (livraison && existingCommande.livraison) {
      await prisma.livraison.update({
        where: { id: existingCommande.livraison.id }, // Utilise l'ID de la livraison existante
        data: {
          adresse: livraison.adresse,
          ville: livraison.ville,
          codePostal: livraison.codePostal,
          pays: livraison.pays,
        },
      });
    }

    console.log("PATCH API/commande/" + slug + ": commande updated:", updatedCommande);
    return NextResponse.json(updatedCommande);

  } catch (error: unknown) {
    console.error("Error updating commande:", error);
  
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; 

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const commandeId = parseInt(slug);

    const existingCommande = await prisma.commande.findUnique({
      where: { id: commandeId },
      include: {
        quantites: true,
        livraison: true,
      },
    });

    if (!existingCommande) {
      return NextResponse.json({ error: 'Commande not found' }, { status: 404 });
    }

    // Supprime les enregistrements associés
    if (existingCommande.quantites && existingCommande.quantites.length > 0) {
      await prisma.quantiteCommande.deleteMany({
        where: { fk_commande: commandeId },
      });
    }

    // Supprime les informations de livraison
    if (existingCommande.livraison) {
      await prisma.livraison.delete({
        where: { id: existingCommande.livraison.id },
      });
    }

    // Supprime la commande
    await prisma.commande.delete({
      where: { id: commandeId },
    });

    console.log("DELETE API/commande/" + slug + ": commande deleted successfully");
    return NextResponse.json({ message: 'Commande deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting commande:", error);
  
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  
}
