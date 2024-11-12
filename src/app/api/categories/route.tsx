import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { Categorie } from '../../types';

export async function GET() {
  try {
    console.log("Fetching all categories...");

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

export async function POST(request: Request) {
  try {
    const body: Categorie = await request.json();
    const { name, description, imageId, parentId } = body;

    console.log('Received body:', body);
    if (!name || !description || !imageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');

    if ('id' in body) {
      delete body.id;
    }
    console.log('Creating category with body:', body);
    const newCategory = await prisma.categorie.create({
      data: {
        name: name,
        description: description,
        slug: slug,
        imageId: parseInt(imageId.toString()),
        parentId: parentId ? parseInt(parentId.toString()) : null,
      },
    });

    console.log('Category created:', newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
