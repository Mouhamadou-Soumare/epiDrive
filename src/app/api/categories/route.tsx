import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      where: { parentId: null }, 
      select: {
        id: true,
        name: true,
        slug: true,
        image: {
          select: { path: true },  
        },
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
      },
    });

    const formattedCategories = categories.map(category => ({
      name: category.name,
      slug: category.slug,
      imageSrc: category.image?.path || 'https://via.placeholder.com/300',
      imageAlt: `Image de la catégorie ${category.name}`,
      subcategories: category.subcategories.map(subcategory => ({
        name: subcategory.name,
        slug: subcategory.slug,
        imageSrc: subcategory.image?.path || 'https://via.placeholder.com/300',
        imageAlt: `Image de la sous-catégorie ${subcategory.name}`,
      })),
    }));

    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories et sous-catégories :", error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
