import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { promises as fs } from "fs";
import path from "path";

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
      stock: product.stock,
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const prix = parseFloat(formData.get("prix") as string);
    const categorieId = parseInt(formData.get("categorieId") as string, 10);
    const newImage = formData.get("newImage") as File | null;

    if (!name || !prix || !description || !categorieId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Vérifier si le produit existe déjà
    const existingProduct = await prisma.produit.findUnique({ where: { slug } });
    if (existingProduct) {
      return NextResponse.json({ error: "Un produit avec ce nom existe déjà" }, { status: 400 });
    }

    // Création du produit sans image
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

      const newImageRecord = await prisma.image.create({ data: { path: imagePath } });

      imageId = newImageRecord.id;
    }

    if (imageId) {
      await prisma.produit.update({
        where: { id: newProduct.id },
        data: { imageid: imageId },
      });
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    return NextResponse.json({ error: "Échec de la création du produit" }, { status: 500 });
  }
}
