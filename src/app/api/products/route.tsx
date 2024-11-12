import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { Produit } from '../../types';

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
    const body: Produit = await request.json();
    const { name, description, prix, categorieId } = body;

    console.log('Received body:', body);
    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');

    if ('id' in body) {
      delete body.id;
    }
    console.log('Creating product with body:', body);
    const newProduct = await prisma.produit.create({
      data: {
        name: name,
        description: description,
        prix: parseFloat(prix.toString()), 
        slug: slug,
        categorieId: parseInt(categorieId.toString()),
        imageid: null

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
