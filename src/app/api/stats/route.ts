import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const userOrders = await prisma.commande.findMany({
      where: {
        user: {
          id: parseInt(userId),
        },
      }
    });

    const totalSpent = await prisma.quantiteCommande.aggregate({
      _sum: {
        prix: true,
      },
      where: {
        commande: {
          user: {
            id: parseInt(userId),
          },
        },
      },
    });

    console.log('Successfully retrieved statistics:', {
      ordersThisMonth: userOrders,
      totalSpent: totalSpent._sum.prix
    });

    // Structurer les statistiques
    const stats = {
      ordersThisMonth: userOrders.length || 0,
      totalSpent: totalSpent._sum.prix || 0
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
