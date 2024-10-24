import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';

export async function createProducts(subCategory, existingSubCategory) {
    for (const product of subCategory.produits || []) {
        const existingProduct = await prisma.produit.findFirst({
            where: {
                name: product.name,
                categorieId: existingSubCategory.id,
            },
        });

        if (!existingProduct) {
            await prisma.produit.create({
                data: {
                    name: product.name,
                    slug: generateSlug(product.name),
                    description: product.description,
                    price: product.price,
                    categorie: {
                        connect: {
                            id: existingSubCategory.id
                        },
                    },
                },
            });
            console.log(`Produit ${product.name} ajouté sous ${subCategory.name}`);
        } else {
            console.log(`Le produit ${product.name} existe déjà sous ${subCategory.name}`);
        }
    }
}
