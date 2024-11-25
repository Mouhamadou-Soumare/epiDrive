import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit } from '../../../../types';

export async function GET() {
  try {
    console.log("Fetching all products...");

    const products = await prisma.produit.findMany({
      include: {
        image: true,
        categorie: true
      },
    });
    
    // Check si il y a des produits en BDD
    if (products.length === 0) {
      console.log("No products found")
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    // Récuperer les catégories 
    const categories = await prisma.categorie.findMany();
    if (categories.length === 0) {
      console.log("No categories found")
      return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    // Récuperer les catégories 
    const images = await prisma.image.findMany();
    if (images.length === 0) {
      console.log("No images found")
      return NextResponse.json({ message: 'No images found' }, { status: 404 });
    }

    //Récupeter les infos principal du produit
    const transformedProducts = products.map((product: Produit) => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      imageId: images.find((image: { id: number }) => image.id === product.imageId) || '',
      slug: product.slug,
      description: product.description,
      categorie: categories.find((categorie: { id: number }) => categorie.id === product.categorieId)?.name || '',
    }));


    console.log("GET API/products: products found:", transformedProducts);
    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextResponse) {
  try {
    const body = await request.json();

    // Vérifier si l'appel concerne la recherche de produits par ingrédients
    if (body.ingredients && Array.isArray(body.ingredients) && body.ingredients.length > 0) {
      const { ingredients } = body;

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

      const transformedProducts = products.map((product: Produit) => ({
        id: product.id,
        name: product.name,
        prix: product.prix,
        imageSrc: product.imageId ? `/path/to/images/${product.imageId}` : '',
        slug: product.slug,
      }));

      return NextResponse.json(transformedProducts, { status: 200 });
    }

    // Vérifier si l'appel concerne la création d'un nouveau produit
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
        categorieId: parseInt(categorieId.toString())
      },
      include: {
        image: true,
      },
    });

    if(path) {
      const newImage = await prisma.image.create({
        data: {
          path: path
        },
      });
      await prisma.produit.update({
        where: { slug },
        data: {
          imageid: newImage.id
        }
      });

      console.log("Image created", newImage);     
    }

    console.log("POST API/product/ : ", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
