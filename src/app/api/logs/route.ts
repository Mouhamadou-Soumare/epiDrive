import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère tous les logs
 */
export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      include: { user: true },
    });

    if (!logs.length) {
      return NextResponse.json({ message: 'Aucun log trouvé' }, { status: 404 });
    }

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error(' Erreur lors de la récupération des logs :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Crée un nouveau log
 */
export async function POST(req: Request) {
  try {
    const { action, metadata, fk_userId } = await req.json();

    if (!action || !fk_userId) {
      return NextResponse.json({ error: 'Champs requis manquants : action ou fk_userId' }, { status: 400 });
    }

    const newLog = await prisma.log.create({
      data: { action, metadata, fk_userId },
      include: { user: true },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du log :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
