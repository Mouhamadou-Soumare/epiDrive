import prisma from "../../lib/prisma.mjs";
import { generateSlug } from './generateSlug.mjs';

export async function createProducts(subCategory, existingSubCategory) {
    if (!subCategory || !subCategory.produits) {
        console.log(`Aucun produit à traiter pour la sous-catégorie "${subCategory.name}".`);
        return;
    }

    for (const product of subCategory.produits) {
        try {
            // Vérifiez si le produit existe déjà dans la sous-catégorie existante
            const existingProduct = await prisma.produit.findFirst({
                where: {
                    name: product.name,
                    categorieId: existingSubCategory.id, // Vérification basée sur la catégorie parent
                },
            });

            if (!existingProduct) {
                // Génération d'un slug unique pour le produit
                const productSlug = generateSlug(product.name);

                // Définition du chemin de l'image
                const imagePath = `/img/product/${productSlug}.webp`;

                // Création du produit avec son image associée
                const createdProduct = await prisma.produit.create({
                    data: {
                        name: product.name,
                        slug: productSlug,
                        description: product.description || null,
                        prix: product.price || 0, // Définit un prix par défaut si absent
                        categorie: {
                            connect: {
                                id: existingSubCategory.id, 
                            },
                        },
                        image: {
                            create: {
                                path: imagePath, 
                            },
                        },
                        stock: 10
                    },
                });

                console.log(`Produit "${createdProduct.name}" ajouté sous "${subCategory.name}".`);
            } else {
                console.log(`Le produit "${product.name}" existe déjà sous "${subCategory.name}".`);
            }
        } catch (error) {
            console.error(
                `Erreur lors de la création du produit "${product.name}" sous "${subCategory.name}":`,
                error.message
            );
        }
    }
}
