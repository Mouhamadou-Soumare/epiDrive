import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère un utilisateur par ID avec ses commandes et livraisons
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Vérification de l'ID utilisateur
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: 'ID utilisateur invalide ou manquant.' }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    console.log("🔍 Récupération de l'utilisateur avec l'ID :", userId);

    // Recherche de l'utilisateur avec ses relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        image: true,
        commandes: {
          include: {
            quantites: {
              include: { produit: true },
            },
          },
        },
        livraisons: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Suppression du mot de passe avant de renvoyer l'utilisateur
    const { password, ...userWithoutPassword } = user;

    console.log('Utilisateur trouvé:', userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}


/**
 * Met à jour un utilisateur par ID
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Vérification de l'ID utilisateur
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: 'ID utilisateur invalide ou manquant.' }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    const body = await req.json();
    const { username, email, role, imageId } = body;

    console.log('Mise à jour de l\'utilisateur avec l\'ID :', userId);

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, role, imageId },
    });

    // Suppression du mot de passe avant de renvoyer l'utilisateur
    const { password, ...userWithoutPassword } = updatedUser;

    console.log('Utilisateur mis à jour :', userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

/**
 * Supprime un utilisateur par ID
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Vérification de l'ID utilisateur
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: 'ID utilisateur invalide ou manquant.' }, { status: 400 });
    }

    const userId = parseInt(id, 10);
    console.log('🗑 Suppression de l\'utilisateur avec l\'ID :', userId);

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Suppression de l'utilisateur
    await prisma.user.delete({ where: { id: userId } });

    console.log('Utilisateur supprimé avec succès :', userId);
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}