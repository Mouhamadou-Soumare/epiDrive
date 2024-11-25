import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit } from 'types';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Fetching product with slug:", slug);

    const product = await prisma.produit.findUnique({
      where: { slug },
      include: {
        image: true,
        categorie: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      prix: product.prix,
      image: product.image?.path || '',
      slug: product.slug,
      description: product.description,
      categorie: product.categorie?.name || 'Uncategorized',
    };

    console.log("GET API/products/" + slug + ": Product found:", transformedProduct);
    return NextResponse.json(transformedProduct, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { name, prix, description, categorieId, path } = data;

  if (!name || !prix || !description || !categorieId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    console.log("Updating product with slug:", slug);

    const existingProduct = await prisma.produit.findUnique({ where: { slug } });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (path) {
      if (!existingProduct.imageid) {
        const newImage = await prisma.image.create({ data: { path } });
        await prisma.produit.update({
          where: { slug },
          data: { imageid: newImage.id },
        });
        console.log("New image created for product:", newImage);
      } else {
        await prisma.image.update({
          where: { id: existingProduct.imageid },
          data: { path },
        });
        console.log("Image updated for product");
      }
    }

    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        name,
        prix: parseFloat(prix),
        description,
        categorieId,
      },
    });

    console.log('PATCH API/products/' + slug + ': Product updated:', updatedProduct);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Deleting product with slug:", slug);

    const product = await prisma.produit.findUnique({ where: { slug } });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.produit.delete({ where: { slug } });
    console.log('DELETE API/products/' + slug + ': Product deleted');
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
