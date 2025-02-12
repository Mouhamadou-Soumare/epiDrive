import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ slug: string }> };

/**
 * Récupère un produit par son `slug`
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    console.log(`Recherche du produit avec le slug : ${slug}`);

    const product = await prisma.produit.findUnique({
      where: { slug },
      include: { image: true, categorie: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      prix: product.prix,
      image: product.image?.path || '',
      slug: product.slug,
      description: product.description,
      categorie: product.categorie?.name || 'Non catégorisé',
    };

    console.log(`Produit trouvé :`, transformedProduct);
    return NextResponse.json(transformedProduct, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Met à jour un produit par son `slug`
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { name, prix, description, categorieId, path } = await req.json();

    if (!slug) return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    console.log(`Mise à jour du produit avec le slug : ${slug}`);

    const existingProduct = await prisma.produit.findUnique({ where: { slug } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Gestion de l'image
    if (path) {
      if (!existingProduct.imageid) {
        const newImage = await prisma.image.create({ data: { path } });
        await prisma.produit.update({ where: { slug }, data: { imageid: newImage.id } });
        console.log(`🖼️ Nouvelle image créée pour le produit : ${newImage.path}`);
      } else {
        await prisma.image.update({ where: { id: existingProduct.imageid }, data: { path } });
        console.log(`🖼️ Image mise à jour pour le produit`);
      }
    }

    // Mise à jour du produit
    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        name,
        prix: parseFloat(prix),
        description,
        categorieId: parseInt(categorieId, 10),
      },
    });

    console.log(`Produit mis à jour :`, updatedProduct);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit :`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Supprime un produit par son `slug`
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) return NextResponse.json({ error: 'Slug requis' }, { status: 400 });

    console.log(`🗑️ Suppression du produit avec le slug : ${slug}`);

    const product = await prisma.produit.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });

    await prisma.produit.delete({ where: { slug } });
    console.log(`Produit supprimé avec succès : ${slug}`);
    return NextResponse.json({ message: 'Produit supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit :`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}