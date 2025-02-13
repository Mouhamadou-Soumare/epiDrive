import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

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
      return NextResponse.json(
        { message: "Aucun produit trouvé" },
        { status: 404 }
      );
    }

    const transformedProducts = products.map((product) => ({
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
      stock: product.stock,
    }));

    console.log(` ${products.length} produits récupérés avec succès.`);
    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la récupération des produits:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Ajoute un nouveau produit avec gestion d'image et mise à jour des recettes associées
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const prix = parseFloat(formData.get("prix") as string);
    const categorieId = parseInt(formData.get("categorieId") as string, 10);
    const newImage = formData.get("newImage") as File | null;

    // Validation des champs requis
    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Vérifier si le produit existe déjà
    const existingProduct = await prisma.produit.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Un produit avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    // Création du produit dans la base de données
    const newProduct = await prisma.produit.create({
      data: {
        name,
        description,
        prix,
        slug,

        categorieId,
        stock: 10,
      },
    });

    let imageId = null;

    if (newImage) {
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/img/product");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const imagePath = `/img/product/${fileName}`;

      const newImageRecord = await prisma.image.create({
        data: { path: imagePath },
      });

      imageId = newImageRecord.id;
    }

    if (imageId) {
      await prisma.produit.update({
        where: { id: newProduct.id },
        data: { imageid: imageId },
      });
    }

    // Récupérer toutes les recettes qui contiennent un ingrédient ayant ce nom
    const recettes = await prisma.recette.findMany({
      where: {
        ingredients: {
          some: {
            name: name,
          },
        },
      },
      include: {
        produits: true,
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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    return NextResponse.json(
      { error: "Échec de la création du produit" },
      { status: 500 }
    );
  }
}
