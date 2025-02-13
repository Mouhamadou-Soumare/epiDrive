import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 🔍 Fonction utilitaire pour exclure le mot de passe de la réponse
const excludePassword = (user: any) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/** 
 * 📌 GET /api/users/[id]
 * Récupérer un utilisateur par ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log("Fetching user with ID:", userId);

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(excludePassword(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** 
 * 📌 PATCH /api/users/[id]
 * Mettre à jour un utilisateur (nécessite ADMIN)
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await req.json();
    const { username, email, role, imageId } = body;

    console.log('Updating user with ID:', userId);

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier si l'utilisateur qui effectue la requête est un ADMIN
    const sessionUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, role, imageId },
    });

    console.log('User updated:', updatedUser);
    return NextResponse.json(excludePassword(updatedUser), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** 
 * 📌 DELETE /api/users/[id]
 * Supprimer un utilisateur (nécessite ADMIN)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log('Deleting user with ID:', userId);

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier si l'utilisateur qui effectue la requête est un ADMIN
    const sessionUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Suppression de l'utilisateur
    await prisma.user.delete({ where: { id: userId } });

    console.log('User deleted:', userId);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
