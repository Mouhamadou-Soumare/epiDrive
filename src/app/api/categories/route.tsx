import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    console.log("Fetching all categories...");
    const categories = await prisma.categorie.findMany({
      include: {
        image: true,
        subcategories: {
          include: {
            image: true,
          },
        },
      },
    });

    if (categories.length === 0) {
        console.error("No categories found");
        return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    const formattedCategories = categories.map((
      categorie: { 
        id: number, name: string, slug: string, image: { path: string } | null, 
        subcategories: { id: number, name: string, slug: string, image: { path: string } | null }[] 
      }
    ) => ({
      id: categorie.id,
      name: categorie.name,
      slug: categorie.slug,
      imageSrc: categorie.image?.path || 'https://via.placeholder.com/300',
      imageAlt: `Image de la catégorie ${categorie.name}`,
      subcategories: categorie.subcategories.map(subcategorie => ({
        name: subcategorie.name,
        slug: subcategorie.slug,
        imageSrc: subcategorie.image?.path || 'https://via.placeholder.com/300',
        imageAlt: `Image de la sous-catégorie ${subcategorie.name}`,
      })),
    }));

    console.log("GET API/categorie: categories found:", formattedCategories);
    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
      console.error("Error in GET API/categorie:", error);
      return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const { name, description, parentId, path } = body;

  try {
    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');
  
    const newcategorie = await prisma.categorie.create({
      data: {
        name: name,
        description: description,
        slug: slug,
        parentId: parentId ? parseInt(body.parentId.toString()) : null,
      },
    });

    if (path) {
      const newImage = await prisma.image.create({
        data: {
          path: body.path
        },
      });

      await prisma.categorie.update({
        where: { id: newcategorie.id },
        data: {
          imageId: newImage.id,
        },
      });

      console.log('Image created:', newImage);
    }

    console.log("POST API/categorie/ : ", newcategorie);
    return NextResponse.json(newcategorie, { status: 201 });
  } catch (error) {
      console.error("Error in POST API/categorie:", error);
      return new Response(JSON.stringify({ error: 'Failed to create categorie' }), { status: 500 });
  }
}
