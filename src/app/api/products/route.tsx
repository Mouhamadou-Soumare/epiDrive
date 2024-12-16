import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit } from 'types';

export async function GET() {
  try {
    console.log("Fetching all products...");

    const products = await prisma.produit.findMany({
      include: {
        image: true,
        categorie: true,
      },
    });

    if (products.length === 0) {
      console.log("No products found");
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      image: product.image
        ? { id: product.image.id, path: product.image.path }
        : null,
      slug: product.slug,
      description: product.description,
      categorie: product.categorie
        ? {
            id: product.categorie.id,
            name: product.categorie.name,
            slug: product.categorie.slug,
            description: product.categorie.description,
            imageId: product.categorie.imageId,
            parentId: product.categorie.parentId,
          }
        : null,
    }));

    console.log("GET API/products: products found:", transformedProducts);
    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, prix, categorieId, path } = body;

    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');
    console.log('Creating product with body:', body);

    const newProduct = await prisma.produit.create({
      data: {
        name,
        description,
        prix: parseFloat(prix.toString()),
        slug,
        categorieId: parseInt(categorieId),
      },
    });

    if (path) {
      const newImage = await prisma.image.create({
        data: { path },
      });
      await prisma.produit.update({
        where: { id: newProduct.id },
        data: { imageid: newImage.id },
      });
      console.log("Image created for product:", newImage);
    }

    console.log("POST API/products: Product created:", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
