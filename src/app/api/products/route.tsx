import { NextResponse, NextRequest } from 'next/server';
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
<<<<<<< Updated upstream
    const body: Produit = await request.json();
    const { name, description, prix, categorieId } = body;
=======
    const body = await request.json();

    // Vérifier si l'appel concerne les ingrédients
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

      const transformedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        prix: product.prix,
        imageSrc: product.image?.path || '',
        slug: product.slug,
      }));

      return NextResponse.json(transformedProducts, { status: 200 });
    } 

    // Vérifier si l'appel concerne la création d'un nouveau produit
    const { name, description, prix, categorieId } = body as Produit;
>>>>>>> Stashed changes

    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');
    console.log('Creating product with body:', body);

    const newProduct = await prisma.produit.create({
      data: {
        name: name,
        description: description,
        prix: parseFloat(prix.toString()),
        slug: slug,
        categorieId: parseInt(categorieId.toString()),
<<<<<<< Updated upstream
        imageid: null
      },
    });

    console.log('Product created:', newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
=======
        imageid: null,
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error handling POST request:', error);
>>>>>>> Stashed changes
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
