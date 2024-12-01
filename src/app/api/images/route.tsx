import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("Fetching all images...");

    const images = await prisma.image.findMany();

    if (images.length === 0) {
      return NextResponse.json({ message: 'No images found' }, { status: 404 });
    }

    console.log("GET API/images: images found:", images);
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    console.log('Creating image with body:', body);
    const newImage = await prisma.image.create({
      data: { path },
    });

    console.log('POST API/images: image created:', newImage);
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
