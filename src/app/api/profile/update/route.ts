import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Interface pour les données de mise à jour du profil utilisateur
 */
interface UpdateUserProfileData {
  userId: string;
  username?: string;
  email?: string;
  password?: string;
  imagePath?: string;
}

/**
 * Met à jour les informations d'un utilisateur
 */
async function updateUserProfile(data: UpdateUserProfileData) {
  const { userId, username, email, password, imagePath } = data;

  console.log("Mise à jour du profil utilisateur:", data);

  const userIdInt = parseInt(userId, 10);
  if (isNaN(userIdInt)) {
    return NextResponse.json(
      { error: "ID utilisateur invalide." },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};

  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  if (imagePath) {
    const imageId = parseInt(imagePath, 10);
    if (!isNaN(imageId)) {
      updateData.image = { connect: { id: imageId } };
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
      data: updateData,
      include: { image: true },
    });

    console.log("Utilisateur mis à jour:", updatedUser);
    return NextResponse.json(
      { message: "Profil mis à jour avec succès.", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

/**
 * Interface pour les requêtes de mise à jour de profil
 */
interface ProfileRequestBody extends UpdateUserProfileData {
  action: "updateProfile";
}

/**
 * Route PUT pour la mise à jour du profil utilisateur
 */
export async function PUT(req: NextRequest) {
  try {
    const body: ProfileRequestBody = await req.json();
    console.log("Requête reçue:", body);

    if (body.action !== "updateProfile") {
      return NextResponse.json(
        { error: "Action non reconnue." },
        { status: 400 }
      );
    }

    return await updateUserProfile(body);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
