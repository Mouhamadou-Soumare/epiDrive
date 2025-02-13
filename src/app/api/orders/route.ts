import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Récupère les commandes de l'utilisateur authentifié
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID utilisateur invalide' }, { status: 400 });
    }

    const orders = await prisma.commande.findMany({
      where: { fk_userId: userId },
      include: {
        quantites: { include: { produit: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!orders.length) {
      return NextResponse.json({ message: 'Aucune commande trouvée' }, { status: 404 });
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      total: order.quantites.reduce((sum, q) => sum + q.prix * q.quantite, 0),
      products: order.quantites.map((q) => ({
        id: q.produit.id,
        name: q.produit.name,
        quantity: q.quantite,
        price: q.prix,
      })),
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la récupération des commandes.' },
      { status: 500 }
    );
  }
}