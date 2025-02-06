import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
    }

    const userId = parseInt(session.user.id, 10); // ✅ Conversion sécurisée en nombre

    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: 'ID utilisateur invalide' }), { status: 400 });
    }

    const orders = await prisma.commande.findMany({
      where: { fk_userId: userId },
      include: {
        quantites: {
          include: { produit: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

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

    return new Response(JSON.stringify(formattedOrders), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur lors de la récupération des commandes.' }),
      { status: 500 }
    );
  }
}
