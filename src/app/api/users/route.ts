import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Récupère tous les utilisateurs sans leur mot de passe
 */
export async function GET() {
  try {
    console.log("Récupération de tous les utilisateurs...");

    const users = await prisma.user.findMany({
      include: {
        image: true,
        livraisons: true,
      },
    });

    if (!users.length) {
      return NextResponse.json(
        { message: "Aucun utilisateur trouvé." },
        { status: 404 }
      );
    }

    // Suppression des mots de passe avant d'envoyer les données
    const usersWithoutPassword = users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );

    console.log("Utilisateurs récupérés :", usersWithoutPassword.length);
    return NextResponse.json(usersWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

/**
 * Crée un nouvel utilisateur avec hachage du mot de passe
 */
export async function POST(req: Request) {
  try {
    const { username, email, password, role, imagePath } = await req.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    console.log("Création d'un nouvel utilisateur :", {
      username,
      email,
      role,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (imagePath) {
      await prisma.image.create({
        data: {
          path: imagePath,
          users: { connect: { id: newUser.id } },
        },
      });

      console.log("Image associée à l'utilisateur :", imagePath);
    }

    // Suppression du mot de passe avant de renvoyer l'utilisateur
    const { password: _, ...userWithoutPassword } = newUser;

    console.log("Utilisateur créé :", userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
