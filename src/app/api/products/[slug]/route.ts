import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { promises as fs } from "fs";
import path from "path";

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
      stock: product.stock
    };

    console.log("Produit trouvé :", transformedProduct);
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// 🛠 Handler PATCH : Mettre à jour un produit
export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "Slug requis" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const prix = parseFloat(formData.get("prix") as string);
    const categorieId = parseInt(formData.get("categorieId") as string, 10);
    const newImage = formData.get("newImage") as File | null;

    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const existingProduct = await prisma.produit.findUnique({
      where: { slug },
      include: { image: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    let imageId = existingProduct.imageid;

    if (newImage) {
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/img/product");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const imagePath = `/img/product/${fileName}`;

      if (existingProduct.imageid) {
        await prisma.image.update({
          where: { id: existingProduct.imageid },
          data: { path: imagePath },
        });
      } else {
        const newImageRecord = await prisma.image.create({
          data: { path: imagePath },
        });
        imageId = newImageRecord.id;
      }
    }

    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        name,
        prix,
        description,
        categorieId,
        imageid: imageId,
      },
      include: { image: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


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
