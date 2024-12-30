import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CommandeStatus } from '@prisma/client';

const statusMap: Record<string, CommandeStatus> = {
  pending: CommandeStatus.EN_ATTENTE,
  shipped: CommandeStatus.EXPEDIEE,
  delivered: CommandeStatus.LIVREE,
  cancelled: CommandeStatus.ANNULEE,
};

async function updateUserProfile(data: any) {
  const { userId, username, email, password, imagePath } = data;

  console.log('Mise à jour du profil utilisateur avec les données:', data); // Log des données

  // Convertir userId en entier
  const userIdInt = parseInt(userId, 10);
  if (isNaN(userIdInt)) {
    console.error('ID utilisateur invalide:', userId);
    return NextResponse.json(
      { message: 'ID utilisateur invalide.' },
      { status: 400 }
    );
  }

  const updateData: any = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = password;
  if (imagePath) {
    const imageId = parseInt(imagePath, 10);
    if (!isNaN(imageId)) {
      updateData.image = { connect: { id: imageId } };
    }
  }

  console.log('Données préparées pour Prisma:', updateData); // Log des données Prisma

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt }, // Utilisation de userIdInt (entier)
      data: updateData,
      include: { image: true },
    });

    console.log('Utilisateur mis à jour:', updatedUser); // Log de la réponse Prisma

    return NextResponse.json(
      { message: 'Profil mis à jour avec succès.', updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil dans Prisma:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du profil.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Données reçues:', body); // Ajouter un log des données reçues

    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { message: 'Action non spécifiée.' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'updateProfile':
        return await updateUserProfile(body);
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
