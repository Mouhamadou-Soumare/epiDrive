import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 🛠 Handler GET : Récupérer une livraison par ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ✅ Utilisation de `await`
    const livraisonId = parseInt(id, 10);

    if (isNaN(livraisonId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log("Recherche de la livraison avec l'ID :", livraisonId);

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

    console.log("Livraison trouvée :", livraison);
    return NextResponse.json(livraison);
  } catch (error) {
    console.error("Erreur lors de la récupération de la livraison:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 🛠 Handler DELETE : Supprimer une livraison par ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ✅ Utilisation de `await`
    const livraisonId = parseInt(id, 10);

    if (isNaN(livraisonId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log("Suppression de la livraison avec l'ID :", livraisonId);

    const livraison = await prisma.livraison.findUnique({
      where: { id: livraisonId },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison not found' }, { status: 404 });
    }

    await prisma.livraison.delete({
      where: { id: livraisonId },
    });

    console.log("Livraison supprimée avec succès :", livraisonId);
    return NextResponse.json({ message: 'Livraison deleted successfully' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la livraison:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
