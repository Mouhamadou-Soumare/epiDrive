import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

type Product = { 
  id: number; 
  name: string; 
  prix: number;      
  imageSrc: string; 
  imageAlt: string; 
  slug: string;  
  description: string; 
};

export async function GET() {
  try {
    console.log("Fetching all products...");

    const products = await prisma.produit.findMany({
      include: {
        image: true,
      },
    });

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      imageSrc: product.image?.path || '',
      imageAlt: product.imageAlt || product.name,
      slug: product.slug,
      description: product.description,
    }));

    console.log("Products found:", transformedProducts);

    if (transformedProducts.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 });
    }

    const products = await prisma.produit.findMany({
      where: {
        name: {
          in: ingredients,
        },
      },
      include: {
        image: true,
      },
    });

    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      imageSrc: product.image?.path || '',
      slug: product.slug,
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching matching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
