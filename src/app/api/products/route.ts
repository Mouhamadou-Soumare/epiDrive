import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Création du produit
    const newProduct = await prisma.produit.create({
      data: {
        name,
        description,
        prix: parseFloat(prix.toString()),
        slug,
        categorieId: parseInt(categorieId),
      },
    });

    // Gestion de l'image si un path est fourni
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

    // Récupérer toutes les recettes qui contiennent un ingrédient ayant ce nom
    const recettes = await prisma.recette.findMany({
      where: {
        ingredients: {
          some: {
            name: name, // Vérifie si un ingrédient du même nom existe dans la recette
          },
        },
      },
      include: {
        produits: true, // Pour voir les produits déjà associés
      },
    });

    console.log(`Found ${recettes.length} recipes containing ingredient "${name}"`);

    // Associer le nouveau produit aux recettes trouvées
    if (recettes.length > 0) {
      for (const recette of recettes) {
        await prisma.recette.update({
          where: { id: recette.id },
          data: {
            produits: {
              connect: { id: newProduct.id }, // Associe le produit à la recette
            },
          },
        });
      }
      console.log(`Added new product "${newProduct.name}" to ${recettes.length} recipes`);
    }

    console.log("POST API/products: Product created:", newProduct);
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

