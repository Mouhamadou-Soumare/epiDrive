// src/app/api/auth/register/route.ts
import { hash } from 'bcrypt'; // Utilise bcrypt pour hasher les mots de passe
import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
  }

  // Hash du mot de passe
  const hashedPassword = await hash(password, 10);

  // Crée un nouvel utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: email.split('@')[0],
    },
  });

  return NextResponse.json(user, { status: 201 });
}
