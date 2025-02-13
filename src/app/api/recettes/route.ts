import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Produit, Ingredient } from "types";
import { promises as fs } from "fs";
import path from "path";

/**
 * Récupère toutes les recettes avec leurs détails
 */
export async function GET() {
  try {
    console.log("Récupération de toutes les recettes...");

    const recettes = await prisma.recette.findMany({
      include: {
        user: true,
        produits: {
          include: { categorie: true },
        },
        ingredients: true,
      },
    });

    if (recettes.length === 0) {
      console.log("Aucune recette trouvée.");
      return NextResponse.json(
        { message: "Aucune recette trouvée." },
        { status: 404 }
      );
    }

    const transformedRecettes = recettes.map((recette) => ({
      id: recette.id,
      title: recette.title,
      description: recette.description,
      instructions: recette.instructions,
      image: recette.image || "/img/placeholder.webp",
      user: recette.user
        ? { id: recette.user.id, username: recette.user.username }
        : null,
      produits: recette.produits.map((produit: Produit) => ({
        id: produit.id,
        name: produit.name,
        slug: produit.slug,
        prix: produit.prix,
        description: produit.description || "Aucune description",
        categorieId: produit.categorie?.id || null,
        stock: produit.stock,
      })),
      ingredients: recette.ingredients.map((ingredient: Ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description || "Pas de description",
        prix: ingredient.prix || 0,
        categorie: ingredient.categorie || "Sans catégorie",
      })),
    }));

    console.log(`${recettes.length} recettes trouvées.`);
    return NextResponse.json(transformedRecettes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

/**
 * Crée une nouvelle recette
 */
export async function POST(request: Request) {
  try {
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
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    let imagePath = "/img/recette/default.webp";

    // Gestion de l'upload d'image si une nouvelle image est fournie
    if (newImage) {
      const buffer = Buffer.from(await newImage.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/img/recette");

      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${newImage.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      imagePath = `/img/recette/${fileName}`;
    }

    // Création de la recette dans la base de données
    const newRecette = await prisma.recette.create({
      data: {
        title,
        description,
        instructions,
        image: imagePath,
        user: { connect: { id: userId } },
        produits: { connect: produits.map((id: number) => ({ id })) },
      },
    });

    console.log(`Recette créée avec succès : ${title}`);
    return NextResponse.json(newRecette, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la recette :", error);
    return NextResponse.json(
      { error: "Échec de la création de la recette" },
      { status: 500 }
    );
  }
}
