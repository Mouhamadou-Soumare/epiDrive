import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
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

    // Exclure le mot de passe de la réponse
    const { password, ...userWithoutPassword } = user;

    console.log('GET API/users/' + id + ': user found:', userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { username, email, role, imageId } = body;

    console.log('Updating user with ID:', userId);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, role, imageId },
    });

    // Exclure le mot de passe de la réponse
    const { password, ...userWithoutPassword } = updatedUser;

    console.log('PATCH API/users/' + id + ': user updated:', userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    console.log('Deleting user with ID:', userId);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    console.log('DELETE API/users/' + id + ': user deleted');
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
