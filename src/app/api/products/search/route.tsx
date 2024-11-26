import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const products = await prisma.produit.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        prix: true,
        image: {
          select: { path: true },
        },
        categorie: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    /*
    const formattedProducts = products.map((product: { id: number; name: string; slug: string; description: string; prix: number; image: { path: string } | null; categorie: { id: number; name: string; slug: string } | null }) => ({
      ...product,
      imageSrc: product.image?.path ? `/img/product/${product.slug}.webp` : 'https://via.placeholder.com/300',
      imageAlt: `Image de ${product.name}`,
    }));
    */
   
    const formattedProducts = products.map((product: { id: number; name: string; slug: string; description: string; prix: number; image: { path: string } | null; categorie: { id: number; name: string; slug: string } | null }) => ({
      id: product.id,
      name: product.name,
      prix: product.prix,
      image: product.image?.path || '',
      slug: product.slug,
      description: product.description,
      categorie: product.categorie?.name || 'Uncategorized',
    }));

    const uniqueCategories = Array.from(
      new Set(products.map((product: { categorie: { id: number; name: string; slug: string } | null }) => product.categorie))
    ).map((category) => ({
      id: (category as { id: number; name: string; slug: string } | null)?.id,
      name: (category as { id: number; name: string; slug: string } | null)?.name,
      slug: (category as { id: number; name: string; slug: string } | null)?.slug,
    })).filter(Boolean);

    return NextResponse.json({ products: formattedProducts, categories: uniqueCategories });
  } catch (error) {
    console.error("Erreur lors de la recherche des produits:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}