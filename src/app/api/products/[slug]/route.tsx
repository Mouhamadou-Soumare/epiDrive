import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

type Product = { 
  id: number; 
  name: string; 
  prix: number;
  imageSrc: string; 
  imageAlt: string; 
  slug: string;  
  description: string; 
};

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("Received slug:", slug);   

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Searching for product with slug:", slug);

    const product = await prisma.produit.findUnique({
      where: { slug },
      include: {
        image: true, 
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { id, imageSrc, prix, ...updateData } = data;

  try {
    const existingProduct = await prisma.produit.findUnique({
      where: { slug },
      include: { image: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const imageData = imageSrc
      ? existingProduct.image
        ? { update: { path: imageSrc } } 
        : { create: { path: imageSrc } } 
      : undefined;

    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        ...updateData,
        prix: prix ? parseFloat(prix.toString()) : undefined,
        image: imageData,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await prisma.produit.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
