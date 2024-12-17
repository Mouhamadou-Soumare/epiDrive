import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Récupération parallèle des statistiques
    const [ordersThisMonth, totalSpent, favoriteItems, purchaseHistory] = await Promise.all([
      // Nombre de commandes depuis le début du mois
      prisma.commande.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Somme totale des commandes
      prisma.quantiteCommande.aggregate({
        _sum: { prix: true },
      }),
      // Nombre total de produits (supposés comme favoris)
      prisma.produit.count(),
      // Historique des commandes
      prisma.commande.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { createdAt: true },
      }),
    ]);

    // Grouper les résultats par jour
    const groupedHistory = purchaseHistory.reduce((acc, curr) => {
      const date = curr.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Formatter les données en tableau pour le graphique
    const formattedHistory = Object.keys(groupedHistory).map((date) => ({
      date,
      total: groupedHistory[date],
    }));

    // Structurer les statistiques
    const stats = {
      ordersThisMonth: ordersThisMonth || 0,
      totalSpent: totalSpent._sum.prix || 0,
      favoriteItems: favoriteItems || 0,
      purchaseHistory: formattedHistory,
    };

    console.log('Statistiques récupérées avec succès:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des statistiques.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
