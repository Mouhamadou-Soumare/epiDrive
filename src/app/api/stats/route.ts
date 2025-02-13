import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère les statistiques d'un utilisateur (commandes & total dépensé)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Vérification de l'ID utilisateur
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ error: 'User ID invalide ou manquant.' }, { status: 400 });
    }

    const userIdInt = parseInt(userId, 10);

    // Récupérer toutes les commandes de l'utilisateur
    const userOrders = await prisma.commande.count({
      where: { fk_userId: userIdInt },
    });

    // Calcul du total dépensé par l'utilisateur
    const totalSpent = await prisma.quantiteCommande.aggregate({
      _sum: { prix: true },
      where: { commande: { fk_userId: userIdInt } },
    });

    // Formatage des résultats
    const stats = {
      ordersThisMonth: userOrders,
      totalSpent: totalSpent._sum.prix || 0,
    };

    console.log('Statistiques récupérées avec succès:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des statistiques.' },
      { status: 500 }
    );
  }
}
