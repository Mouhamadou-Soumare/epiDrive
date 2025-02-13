import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Recherche de produits par nom avec récupération des images et catégories associées.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Le paramètre de recherche est requis" },
        { status: 400 }
      );
    }

    console.log(` Recherche de produits contenant : ${query}`);

    const products = await prisma.produit.findMany({
      where: {
        name: {
          contains: query.toLowerCase(), //  Conversion en minuscule pour éviter la casse
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        prix: true,
        imageid: true,
        categorieId: true,
      },
    });

    if (!products.length) {
      return NextResponse.json(
        { message: "Aucun produit trouvé" },
        { status: 404 }
      );
    }

    // Récupération des images et catégories associées
    const images = await prisma.image.findMany({
      where: { id: { in: products.map((p) => p.imageid).filter(Boolean) } },
      select: { id: true, path: true },
    });

    const categories = await prisma.categorie.findMany({
      where: { id: { in: products.map((p) => p.categorieId).filter(Boolean) } },
      select: { id: true, name: true, slug: true },
    });

    // Mapping des produits avec leurs images et catégories
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      slug: product.slug,
      description: product.description,
      imageSrc:
        images.find((img) => img.id === product.imageid)?.path ||
        "https://via.placeholder.com/300",
      imageAlt: `Image de ${product.name}`,
      categorie: categories.find((cat) => cat.id === product.categorieId) || {
        id: null,
        name: "Non catégorisé",
        slug: "",
      },
    }));

    // Extraction des catégories uniques
    const uniqueCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

    console.log(` ${formattedProducts.length} produits trouvés`);
    return NextResponse.json(
      { products: formattedProducts, categories: uniqueCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la recherche des produits:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
