import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';
import { createProducts } from './product.js'; // Importez la fonction createProducts

export async function createSubcategories(category, existingCategory) {
    for (const subCategory of category.subcategories || []) {
        // Recherche de la sous-catégorie dans `Categorie`
        const existingSubCategory = await prisma.categorie.findFirst({
            where: {
                slug: subCategory.slug,
                parentId: existingCategory.id, // Référence au parent
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
                        image: {
                            create: {
                                path: `/img/category/${generateSlug(subCategory.name)}.webp`, // Chemin d'image dynamique pour la sous-catégorie
                            },
                        },
                    },
                });
                console.log(`Sous-catégorie ${createdSubCategory.name} ajoutée sous ${category.title}`);

                // Utilisez createProducts pour ajouter les produits à la sous-catégorie créée
                await createProducts(subCategory, createdSubCategory);

            } catch (error) {
                console.error(`Erreur lors de la création de la sous-catégorie ${subCategory.name}:`, error.message);
            }
        } else {
            console.log(`La sous-catégorie ${subCategory.name} existe déjà.`);
            // Utilisez createProducts pour ajouter les produits à la sous-catégorie existante
            await createProducts(subCategory, existingSubCategory);
        }
    }
}
