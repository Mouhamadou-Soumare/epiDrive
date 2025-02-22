import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, username: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  // Logique pour créer l'utilisateur dans la base de données
  return await prisma.user.create({
    data: {
      email,
      username,
      password: passwordHash,
    },
  });
}

// Fonction pour obtenir un utilisateur par email (déjà utilisée pour l'authentification)
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}
