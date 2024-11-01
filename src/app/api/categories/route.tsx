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
        description: true,
        imageId: true,
        subcategories: { 
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageId: true,
            subcategories: { 
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                imageId: true,
              },
            },
          },
        },
      },
    });

    console.log("Categories found:", categories);

    if (categories.length === 0) {
      return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
