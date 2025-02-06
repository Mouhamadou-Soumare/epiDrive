import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Définition du type des paramètres
type Params = { params: Promise<{ slug: string }> };

// 🛠 Handler GET : Récupérer un produit par son slug
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params; // Attendre la résolution de params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    console.log("Recherche du produit avec le slug :", slug);

    const product = await prisma.produit.findUnique({
      where: { slug },
      include: {
        image: true,
        categorie: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      prix: product.prix,
      image: product.image || '',
      slug: product.slug,
      description: product.description,
      categorie: product.categorie || 'Uncategorized',
    };

    console.log("Produit trouvé :", transformedProduct);
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// 🛠 Handler PATCH : Mettre à jour un produit
// 🛠 Handler PATCH : Mettre à jour un produit
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params; // Attendre la résolution de params
    const data = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { name, prix, description, categorie, path } = data;

    if (!name || !prix || !description || !categorie) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log("Mise à jour du produit avec le slug :", slug);

    const existingProduct = await prisma.produit.findUnique({ where: { slug } });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (path) {
      if (!existingProduct.imageid) {
        const newImage = await prisma.image.create({ data: { path } });
        await prisma.produit.update({
          where: { slug },
          data: { imageid: newImage.id },
        });
        console.log("Nouvelle image créée pour le produit :", newImage);
      } else {
        await prisma.image.update({
          where: { id: existingProduct.imageid },
          data: { path },
        });
        console.log("Image mise à jour pour le produit");
      }
    }

    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        name,
        prix: parseFloat(prix),
        description,
        categorieId: parseInt(categorie.id, 10),
      },
    });

    console.log("Produit mis à jour :", updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// 🛠 Handler DELETE : Supprimer un produit
// 🛠 Handler DELETE : Supprimer un produit
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params; // Attendre la résolution de params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    console.log("Suppression du produit avec le slug :", slug);

    const product = await prisma.produit.findUnique({ where: { slug } });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.produit.delete({ where: { slug } });
    console.log("Produit supprimé avec succès :", slug);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
