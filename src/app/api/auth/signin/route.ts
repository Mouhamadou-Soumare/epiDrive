import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Récupération des données de la requête
    const { email, password } = await req.json();

    // Vérification des champs requis
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 });
    }

    // Recherche de l'utilisateur en base de données
    const user = await prisma.user.findUnique({ where: { email } });

    // Vérification si l'utilisateur existe
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Comparaison du mot de passe fourni avec le hash stocké
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 });
    }

    // Réponse de succès (authentification réussie)
    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
