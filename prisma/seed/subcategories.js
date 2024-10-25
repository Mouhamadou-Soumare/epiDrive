import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';

export async function createSubcategories(category, existingCategory) {
    for (const subCategory of category.subcategories || []) {
        // Recherche de la sous-catégorie dans `Categorie`
        const existingSubCategory = await prisma.categorie.findFirst({
            where: {
                slug: subCategory.slug,
                parentId: existingCategory.id, // Nouvelle référence au parent
            },
        });

        if (!existingSubCategory) {
            try {
                const createdSubCategory = await prisma.categorie.create({
                    data: {
                        name: subCategory.name,
                        slug: generateSlug(subCategory.name),
                        description: subCategory.description,
                        parent: {
                            connect: { id: existingCategory.id }, // Connexion à la catégorie parent
                        },
                    },
                });
                console.log(`Sous-catégorie ${createdSubCategory.name} ajoutée sous ${category.title}`);

                // Ajoutez les produits à la sous-catégorie créée
                if (subCategory.produits) {
                    for (const product of subCategory.produits) {
                        try {
                            await prisma.produit.create({
                                data: {
                                    name: product.name,
                                    slug: generateSlug(product.name),
                                    description: product.description,
                                    prix: product.price,
                                    categorie: {
                                        connect: { id: createdSubCategory.id }, // Associe le produit à la sous-catégorie
                                    },
                                },
                            });
                            console.log(`Produit ${product.name} ajouté sous ${subCategory.name}`);
                        } catch (error) {
                            console.error(`Erreur lors de la création du produit ${product.name}:`, error.message);
                        }
                    }
                }
            } catch (error) {
                console.error(`Erreur lors de la création de la sous-catégorie ${subCategory.name}:`, error.message);
            }
        } else {
            console.log(`La sous-catégorie ${subCategory.name} existe déjà.`);
        }
    }
}
