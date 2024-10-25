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

    console.log("Products found:", products);

    if (products.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, prix, imageSrc, imageAlt, categorieId } = body;

    if (!name || !prix || !imageSrc || !imageAlt || !description || !categorieId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');

    console.log('Creating product with body:', body);
    const newProduct = await prisma.produit.create({
      data: {
        name: name,
        description: description,
        prix: parseFloat(prix), 
        slug: slug,
        categorieId: categorieId,
        image: {                  
          create: {
            path: imageSrc,       
          },
        },
      },
    });

    console.log('Product created:', newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
