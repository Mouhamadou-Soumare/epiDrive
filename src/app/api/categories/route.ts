import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 *  Récupère toutes les catégories avec leurs sous-catégories et images
 */
export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        image: true,
        subcategories: { include: { image: true } },
      },
    });

    if (!categories.length) {
      return NextResponse.json(
        { error: "Aucune catégorie trouvée." },
        { status: 404 }
      );
    }

    const formattedCategories = categories.map(
      ({ id, name, slug, parentId, image, subcategories }) => ({
        id,
        name,
        slug,
        parentId: parentId || null,
        imageSrc: image?.path || "https://via.placeholder.com/300",
        imageAlt: `Image de la catégorie ${name}`,
        subcategories: subcategories.map(
          ({ id, name, slug, parentId, image }) => ({
            id,
            name,
            slug,
            parentId: parentId || null,
            imageSrc: image?.path || "https://via.placeholder.com/300",
            imageAlt: `Image de la sous-catégorie ${name}`,
          })
        ),
      })
    );

    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la récupération des catégories :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Création d'une nouvelle catégorie avec gestion optionnelle d'image
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId")
      ? parseInt(formData.get("parentId") as string, 10)
      : null;
    const newImage = formData.get("newImage") as File | null;

    if (!name || !description || !newImage) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Création de la catégorie sans image
    const newCategory = await prisma.categorie.create({
      data: {
        name,
        description,
        slug,
        parentId: parentId ? parseInt(parentId.toString(), 10) : null,
      },
    });

    let imageId = null;

    if (newImage) {
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/img/category");
      await fs.mkdir(uploadDir, { recursive: true }); // Crée le dossier s'il n'existe pas

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const imagePath = `/img/category/${fileName}`; // Chemin relatif pour l'image

      // Ajouter l'image dans la base de données
      const newImageRecord = await prisma.image.create({
        data: { path: imagePath },
      });

      imageId = newImageRecord.id;
    }

    // Mise à jour de la catégorie avec l'image (si une image a été uploadée)
    if (imageId) {
      await prisma.categorie.update({
        where: { id: newCategory.id },
        data: { imageId },
      });
    }

    // Récupérer la catégorie mise à jour avec l'image
    const createdCategory = await prisma.categorie.findUnique({
      where: { id: newCategory.id },
      include: { image: true },
    });

    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    return NextResponse.json(
      { error: "Échec de la création de la catégorie" },
      { status: 500 }
    );
  }
}
