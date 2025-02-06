import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Définition du type pour les données de mise à jour de l'utilisateur
interface UpdateUserProfileData {
  userId: string;
  username?: string;
  email?: string;
  password?: string;
  imagePath?: string;
}

// Fonction pour mettre à jour le profil utilisateur
async function updateUserProfile(data: UpdateUserProfileData) {
  const { userId, username, email, password, imagePath } = data;

  console.log('Mise à jour du profil utilisateur avec les données:', data);

  // Convertir userId en entier
  const userIdInt = parseInt(userId, 10);
  if (isNaN(userIdInt)) {
    console.error('ID utilisateur invalide:', userId);
    return NextResponse.json(
      { message: 'ID utilisateur invalide.' },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = password;
  if (imagePath) {
    const imageId = parseInt(imagePath, 10);
    if (!isNaN(imageId)) {
      updateData.image = { connect: { id: imageId } };
    }
  }

  console.log('Données préparées pour Prisma:', updateData);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
      data: updateData,
      include: { image: true },
    });

    console.log('Utilisateur mis à jour:', updatedUser);

    return NextResponse.json(
      { message: 'Profil mis à jour avec succès.', updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la mise à jour du profil dans Prisma:', error);
      return NextResponse.json(
        { message: 'Erreur lors de la mise à jour du profil.', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Erreur inconnue.' },
      { status: 500 }
    );
  }
}

// Définition du type des actions reçues
type ProfileAction = 'updateProfile';

interface ProfileRequestBody {
  action: ProfileAction;
  userId: string;
  username?: string;
  email?: string;
  password?: string;
  imagePath?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const body: ProfileRequestBody = await req.json();
    console.log('Données reçues:', body);

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur API:', error);
      return NextResponse.json(
        { message: 'Erreur interne du serveur.', error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Erreur inconnue.' },
      { status: 500 }
    );
  }
}
