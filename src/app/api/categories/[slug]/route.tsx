import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  try {
    const category = await prisma.categorie.findFirst({
      where: {
        OR: [
          { slug },
          { id: parseInt(slug, 10) || -1 } 
        ]
      },
      include: {
        subcategories: {
          select: {
            id: true, name: true, slug: true,
            image: {
              select: { path: true },
            },
          },
        },
        produits: {
          select: { id: true, name: true, slug: true, description: true, prix: true,
            image: {
              select: { path: true },
            },
          },
        },
        image: {
          select: { path: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Formatage de la réponse
    const formattedCategory = {
      ...category,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        imageSrc: subcategory.image?.path ? `/img/category/${subcategory.slug}.webp` : 'https://via.placeholder.com/300',
        imageAlt: `Image de la sous-catégorie ${subcategory.name}`,
      })),
      produits: category.produits.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        prix: product.prix,
        imageSrc: product.image?.path ? product.image.path : 'https://via.placeholder.com/300',
        imageAlt: `Image de ${product.name}`,
      })),
    };

    console.log("GET API/categorie/" + slug + ": categories found:", formattedCategory);
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { name, description, image, parentId } = data;
  try {
    console.log("Updating category with slug:", slug);
    const existingCategory = await prisma.categorie.findUnique({
      where: { slug }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updatedCategory = await prisma.categorie.update({
      where: { slug },
      data: {
        name,
        description,
        image: image ? {
          update: {
            path: image.path,
          },
        } : undefined,
        parent: parentId ? {
          connect: { id: parentId },
        } : undefined
      },
    });

    console.log("PATCH API/categorie/" + slug + ": category updated:", updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error: unknown) {
    console.error("Error updating category:", error);
  
    let errorMessage = "Internal Server Error";
  
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  
  
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Attendre la résolution de params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await prisma.categorie.delete({
      where: { slug },
    });

    console.log("DELETE API/categorie/" + slug + ": category deleted");
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
