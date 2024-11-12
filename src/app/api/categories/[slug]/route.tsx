import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const category = await prisma.categorie.findUnique({
      where: { slug },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: {
              select: { path: true },
            },
          },
        },
        produits: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            prix: true,
            image: {
              select: { path: true },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Formatage de la réponse avec les sous-catégories et les produits
    const formattedCategory = {
      ...category,
      subcategories: category.subcategories.map(subcategory => ({
        name: subcategory.name,
        slug: subcategory.slug,
        imageSrc: subcategory.image?.path ? `/img/category/${subcategory.slug}.webp` : 'https://via.placeholder.com/300',
        imageAlt: `Image de la sous-catégorie ${subcategory.name}`,
      })),
      produits: category.produits.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        prix: product.prix,
        imageSrc: product.image?.path ? product.image.path : 'https://via.placeholder.com/300',
        imageAlt: `Image de ${product.name}`,
      })),
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
