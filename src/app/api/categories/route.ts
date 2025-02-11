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
      return NextResponse.json({ error: "Aucune catégorie trouvée." }, { status: 404 });
    }

    const formattedCategories = categories.map(({ id, name, slug, parentId, image, subcategories }) => ({
      id,
      name,
      slug,
      parentId: parentId || null,
      imageSrc: image?.path || "https://via.placeholder.com/300",
      imageAlt: `Image de la catégorie ${name}`,
      subcategories: subcategories.map(({ id, name, slug, parentId, image }) => ({
        id,
        name,
        slug,
        parentId: parentId || null,
        imageSrc: image?.path || "https://via.placeholder.com/300",
        imageAlt: `Image de la sous-catégorie ${name}`,
      })),
    }));

    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la récupération des catégories :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

/**
 * Création d'une nouvelle catégorie avec gestion optionnelle d'image
 */
export async function POST(req: Request) {
  try {
    const { name, description, parentId, path } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const newCategory = await prisma.categorie.create({
      data: {
        name,
        description,
        slug,
        parentId: parentId ? parseInt(parentId.toString(), 10) : null,
      },
    });

    if (path) {
      const newImage = await prisma.image.create({ data: { path } });

      await prisma.categorie.update({
        where: { id: newCategory.id },
        data: { imageId: newImage.id },
      });
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(" Erreur lors de la création de la catégorie :", error);
    return NextResponse.json({ error: "Échec de la création de la catégorie" }, { status: 500 });
  }
}
