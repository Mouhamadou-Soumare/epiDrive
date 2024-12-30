import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CommandeStatus } from '@prisma/client';

const statusMap: Record<string, CommandeStatus> = {
  pending: CommandeStatus.EN_ATTENTE,
  shipped: CommandeStatus.EXPEDIEE,
  delivered: CommandeStatus.LIVREE,
  cancelled: CommandeStatus.ANNULEE,
};

async function updateUserProfile(formData: FormData) {
  const userId = formData.get('userId') as string;
  const username = formData.get('username') as string | null;
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;
  const imagePath = formData.get('imagePath') as string | null;

  if (!userId) {
    return NextResponse.json(
      { message: 'ID utilisateur requis.' },
      { status: 400 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: {
      username: username || undefined,
      email: email || undefined,
      password: password || undefined,
      image: imagePath
        ? {
            connect: { id: parseInt(imagePath, 10) },
          }
        : undefined,
    },
    include: { image: true },
  });

  return NextResponse.json(
    { message: 'Profil mis à jour avec succès.', updatedUser },
    { status: 200 }
  );
}

async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as string;

  if (!orderId || !status) {
    return NextResponse.json(
      { message: 'ID de commande et statut requis.' },
      { status: 400 }
    );
  }

  const prismaStatus = statusMap[status.toLowerCase()];
  if (!prismaStatus) {
    return NextResponse.json(
      { message: 'Statut de commande invalide.' },
      { status: 400 }
    );
  }

  const updatedOrder = await prisma.commande.update({
    where: { id: parseInt(orderId, 10) },
    data: { status: prismaStatus },
  });

  return NextResponse.json(
    { message: `Commande ${orderId} mise à jour avec le statut ${prismaStatus}.`, updatedOrder },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = formData.get('action') as string;

    if (!action) {
      return NextResponse.json(
        { message: 'Action non spécifiée.' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'updateProfile':
        return await updateUserProfile(formData);
      case 'updateOrderStatus':
        return await updateOrderStatus(formData);
      default:
        return NextResponse.json(
          { message: 'Action non reconnue.' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur.', error: (error as any).message },
      { status: 500 }
    );
  }
}