import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';

export async function createSubcategories(category, existingCategory) {
    for (const subCategory of category.subcategories || []) {
        const existingSubCategory = await prisma.categorie.findFirst({
            where: {
                slug: subCategory.slug,
                parentId: existingCategory.id,
            },
        });

        if (!existingSubCategory) {
            try {
                const createdSubCategory = await prisma.categorie.create({
                    data: {
                        name: subCategory.name,
                        slug: subCategory.slug,
                        description: subCategory.description,
                        parent: {
                            connect: {
                                id: existingCategory.id
                            },
                        },
                        produits: {
                            create: subCategory.produits?.map((product) => ({
                                name: product.name,
                                slug: generateSlug(product.name),
                                description: product.description,
                                price: product.price,
                            })),
                        },
                    },
                });
                console.log(`Sous-catégorie ${createdSubCategory.name} ajoutée sous ${category.title}`);
            } catch (error) {
                console.error(`Erreur lors de la création de la sous-catégorie ${subCategory.name}:`, error.meta?.target);
            }
        } else {
            console.log(`La sous-catégorie ${subCategory.name} existe déjà.`);
        }
    }
}
