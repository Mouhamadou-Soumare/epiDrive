import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

export async function POST(req: Request) {
  try {
    // Récupération des données de la requête
    const { email, password } = await req.json();

    // Vérification des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });

    // Vérification si l'utilisateur existe
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est bloqué
    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      return NextResponse.json(
        {
          message: "Trop de tentatives. Réessayez plus tard.",
        },
        { status: 429 }
      );
    }

    // Vérifier le mot de passe

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const updatedAttempts = user.loginAttempts + 1;

      if (updatedAttempts >= MAX_ATTEMPTS) {
        await prisma.user.update({
          where: { email },
          data: {
            loginAttempts: updatedAttempts,
            blockedUntil: new Date(Date.now() + BLOCK_TIME),
          },
        });
        return NextResponse.json(
          { message: "Compte bloqué temporairement." },
          { status: 429 }
        );
      }

      await prisma.user.update({
        where: { email },
        data: { loginAttempts: updatedAttempts },
      });

      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Réinitialiser les tentatives après un succès
    await prisma.user.update({
      where: { email },
      data: { loginAttempts: 0, blockedUntil: null },
    });

    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
