import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Attendre que params soit résolu

  if (!id) {
    console.error("ID is required for GET /api/images/[id]");
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    console.log('GET API/images/' + id + ': image found:', image);
    return NextResponse.json(image, { status: 200 });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Attendre que params soit résolu

  if (!id) {
    console.error("ID is required for PATCH /api/images/[id]");
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const existingImage = await prisma.image.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(id) },
      data: { path },
    });

    console.log('PATCH API/images/' + id + ': image updated:', updatedImage);
    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Attendre que params soit résolu

  if (!id) {
    console.error("ID is required for DELETE /api/images/[id]");
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.image.delete({
      where: { id: parseInt(id) },
    });

    console.log('DELETE API/images/' + id + ': image deleted');
    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
