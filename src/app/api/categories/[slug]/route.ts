import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Récupère une catégorie et ses sous-catégories/produits à partir du slug ou de l'ID.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) return NextResponse.json({ error: "Slug requis" }, { status: 400 });

  try {
    const category = await prisma.categorie.findFirst({
      where: {
        OR: [
          { slug },
          { id: parseInt(slug, 10) || -1 }, // Permet de récupérer par ID si slug est un nombre
        ],
      },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: { select: { path: true } },
          },
        },
        produits: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            prix: true,
            image: { select: { path: true } },
          },
        },
        image: { select: { path: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    // Formatage des données pour un affichage propre côté frontend
    const formattedCategory = {
      ...category,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        imageSrc: subcategory.image?.path
          ? `/img/category/${subcategory.slug}.webp`
          : "https://via.placeholder.com/300",
        imageAlt: `Image de la sous-catégorie ${subcategory.name}`,
      })),
      produits: category.produits.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        prix: product.prix,
        imageSrc: product.image?.path
          ? product.image.path
          : "https://via.placeholder.com/300",
        imageAlt: `Image de ${product.name}`,
      })),
    };

    console.log(`Catégorie trouvée: ${slug}`, formattedCategory);
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error(" Erreur lors de la récupération de la catégorie :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}


/**
 * Met à jour une catégorie via son slug
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug requis" }, { status: 400 });
  }

  const { name, description, image, parentId } = data;

  try {
    console.log(`Mise à jour de la catégorie: ${slug}`);

    const existingCategory = await prisma.categorie.findUnique({
      where: { slug },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    const updatedCategory = await prisma.categorie.update({
      where: { slug },
      data: {
        name,
        description,
        image: image
          ? { update: { path: image.path } }
          : undefined,
        parent: parentId
          ? { connect: { id: parentId } }
          : undefined,
      },
    });

    console.log(`Catégorie mise à jour: ${slug}`, updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Supprime une catégorie via son slug
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug requis" }, { status: 400 });
  }

  try {
    await prisma.categorie.delete({
      where: { slug },
    });

    console.log(` Catégorie supprimée: ${slug}`);
    return NextResponse.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}