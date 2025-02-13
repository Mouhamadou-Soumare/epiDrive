import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Récupère un ingrédient par son slug
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Le slug est requis" }, { status: 400 });
  }

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(slug, 10) },
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingrédient non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(ingredient, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l’ingrédient :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Supprime un ingrédient par son slug
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Le slug est requis" }, { status: 400 });
  }

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(slug, 10) },
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingrédient non trouvé" },
        { status: 404 }
      );
    }

    await prisma.ingredient.delete({ where: { id: parseInt(slug, 10) } });

    return NextResponse.json(
      { message: "Ingrédient supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l’ingrédient :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
