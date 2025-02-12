import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Récupère tous les produits avec leurs catégories et images
 */
export async function GET() {
  try {
    console.log("Récupération de tous les produits...");

    const products = await prisma.produit.findMany({
      include: {
        image: true,
        categorie: true,
      },
    });

    if (!products.length) {
      console.log("Aucun produit trouvé.");
      return NextResponse.json({ message: 'Aucun produit trouvé' }, { status: 404 });
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

    console.log(` ${products.length} produits récupérés avec succès.`);
    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error(' Erreur lors de la récupération des produits:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

/**
 * Ajoute un nouveau produit avec gestion d'image et mise à jour des recettes associées
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, prix, categorieId, path } = body;

    // Validation des champs requis
    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    console.log(`Création du produit : ${name}`);

    // Création du produit dans la base de données
    const newProduct = await prisma.produit.create({
      data: {
        name,
        description,
        prix: parseFloat(prix.toString()),
        slug,
        categorieId: parseInt(categorieId, 10),
      },
    });

    // Ajout de l'image si fournie
    if (path) {
      const newImage = await prisma.image.create({ data: { path } });
      await prisma.produit.update({
        where: { id: newProduct.id },
        data: { imageid: newImage.id },
      });
      console.log("Image ajoutée au produit :", newImage);
    }

    // Recherche des recettes associées à l'ingrédient
    const recettes = await prisma.recette.findMany({
      where: {
        ingredients: { some: { name } },
      },
      include: { produits: true },
    });

    console.log(`${recettes.length} recettes contiennent l'ingrédient "${name}"`);

    // Mise à jour des recettes pour inclure le nouveau produit
    if (recettes.length > 0) {
      for (const recette of recettes) {
        await prisma.recette.update({
          where: { id: recette.id },
          data: {
            produits: { connect: { id: newProduct.id } },
          },
        });
      }
      console.log(`Produit "${newProduct.name}" ajouté à ${recettes.length} recettes`);
    }

    console.log("Produit créé avec succès :", newProduct);
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}