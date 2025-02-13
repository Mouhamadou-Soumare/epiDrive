import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

/**
 * Récupère une recette spécifique via son slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug requis." }, { status: 400 });
    }

    const recette = await prisma.recette.findUnique({
      where: { id: parseInt(slug, 10) },
      include: {
        user: { select: { id: true, username: true } },
        produits: {
          select: { id: true, name: true, slug: true, prix: true, stock: true },
        },
        ingredients: { select: { id: true, name: true } },
      },
    });

    if (!recette) {
      return NextResponse.json(
        { error: "Recette non trouvée." },
        { status: 404 }
      );
    }

    const formattedRecette = {
      id: recette.id,
      title: recette.title,
      description: recette.description,
      instructions: recette.instructions,
      image: recette.image || "/img/placeholder.webp",
      user: recette.user,
      produits: recette.produits,
      ingredients: recette.ingredients,
    };

    console.log(`Recette trouvée: ${recette.title}`);
    return NextResponse.json(formattedRecette, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

/**
 * Met à jour une recette spécifique via son slug
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug requis." }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const instructions = formData.get("instructions") as string;
    const userId = parseInt(formData.get("userId") as string, 10);
    const produits = formData.get("produits")
      ? JSON.parse(formData.get("produits") as string)
      : [];
    const newImage = formData.get("newImage") as File | null;

    if (!title || !description || !instructions || isNaN(userId)) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    const existingRecette = await prisma.recette.findUnique({
      where: { id: parseInt(slug, 10) },
    });
    if (!existingRecette) {
      return NextResponse.json(
        { error: "Recette non trouvée." },
        { status: 404 }
      );
    }

    let imagePath = existingRecette.image;
    if (newImage) {
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/img/recette");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      imagePath = `/img/recette/${fileName}`;
    }

    const updatedRecette = await prisma.recette.update({
      where: { id: parseInt(slug, 10) },
      data: {
        title,
        description,
        instructions,
        image: imagePath,
        user: { connect: { id: userId } },
        produits: { set: produits.map((id: number) => ({ id })) },
      },
    });

    console.log(`Recette mise à jour : ${updatedRecette.title}`);
    return NextResponse.json(updatedRecette, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la recette :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

/**
 * Supprime une recette spécifique via son slug
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug requis." }, { status: 400 });
    }

    await prisma.recette.delete({
      where: { id: parseInt(slug, 10) },
    });

    console.log(`Recette supprimée : ${slug}`);
    return NextResponse.json(
      { message: "Recette supprimée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
