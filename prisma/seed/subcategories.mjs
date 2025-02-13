import prisma from "../../lib/prisma.mjs";
import { generateSlug } from './generateSlug.mjs';
import { createProducts } from './product.mjs'; // Importez la fonction createProducts

export async function createSubcategories(category, existingCategory) {
    if (!category || !category.subcategories) {
        console.log("Aucune sous-catégorie à traiter pour cette catégorie.");
        return;
    }

    for (const subCategory of category.subcategories) {
        try {
            // Recherche de la sous-catégorie existante dans `Categorie`
            const existingSubCategory = await prisma.categorie.findFirst({
                where: {
                    slug: generateSlug(subCategory.name),
                    parentId: existingCategory.id, // Référence à la catégorie parent
                },
            });

            if (!existingSubCategory) {
                // Création de la sous-catégorie si elle n'existe pas
                const createdSubCategory = await prisma.categorie.create({
                    data: {
                        name: subCategory.name,
                        slug: generateSlug(subCategory.name),
                        description: subCategory.description || null,
                        parent: {
                            connect: { id: existingCategory.id }, // Connexion à la catégorie parent
                        },
                        image: {
                            create: {
                                path: `/img/category/${generateSlug(subCategory.name)}.webp`, // Chemin d'image dynamique
                            },
                        },
                    },
                });
                console.log(`Sous-catégorie "${createdSubCategory.name}" ajoutée sous "${existingCategory.name}"`);

                // Ajout des produits à la sous-catégorie nouvellement créée
                await createProducts(subCategory, createdSubCategory);
            } else {
                console.log(`Sous-catégorie "${subCategory.name}" existe déjà sous "${existingCategory.name}".`);
                // Ajout des produits à la sous-catégorie existante
                await createProducts(subCategory, existingSubCategory);
            }
        } catch (error) {
            console.error(
                `Erreur lors du traitement de la sous-catégorie "${subCategory.name}" sous "${existingCategory.name}":`,
                error.message
            );
        }
    }
}
