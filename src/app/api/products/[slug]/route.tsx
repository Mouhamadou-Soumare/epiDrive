import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Produit } from 'types';

export async function GET(req: NextResponse, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("Received slug:", slug);   

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log("Searching for product with slug:", slug);

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

    // Récuperer les catégories 
    const categories = await prisma.categorie.findMany();
    if (categories.length === 0) {
      console.log("No categories found")
      return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    // Récuperer les catégories 
    const images = await prisma.image.findMany();
    if (images.length === 0) {
      console.log("No images found")
      return NextResponse.json({ message: 'No images found' }, { status: 404 });
    }

    console.log(product)
    //Récupeter les infos principal du produit
    const transformedProduct = {
      id: product.id,
      name: product.name,
      prix: product.prix,
      imageId: images.find((image: { id: number }) => image.id === product.image.id).id,
      slug: product.slug,
      description: product.description,
      categorie: categories.find((categorie: { id: number }) => categorie.id === product.categorieId)?.name || '',
    };

    console.log("GET API/categorie/"+slug+": categories found:", transformedProduct);
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextResponse, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { name, prix, description, categorieId, path } = data;

  if(!name || !prix || !description || !categorieId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    console.log("Updating product with slug:", slug);
    const existingProduct: Produit = await prisma.produit.findUnique({
      where: { slug },
      include: { image: true }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if(path) {
      // Check si l'image existe
      if (!existingProduct.imageId) {
        const newImage = await prisma.image.create({
          data: {
            path: path
          },
        });

        await prisma.produit.update({
          where: { slug },
          data: {
            imageid: newImage.id
          }
        });
        console.log("Image created", newImage);
      } else { // Mettre à jour l'image
        
        const updatedImage = await prisma.image.update({
          where: { id: existingProduct.imageId },
          data: {
            path
          },
        });
        console.log("Image updated", updatedImage);
      }      
    }


    //Mettre à jour le produit
    const updatedProduct = await prisma.produit.update({
      where: { slug },
      data: {
        name: name,
        prix: parseFloat(prix.toString()),
        description: description,
        categorieId: categorieId,
      },
    });

    console.log('PATCH API/product/' + slug + ': product updated:', updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextResponse, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await prisma.produit.delete({
      where: { slug },
    });

    console.log('DELETE API/product/' + slug + ': product deleted');
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
