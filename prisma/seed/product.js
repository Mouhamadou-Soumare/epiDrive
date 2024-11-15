import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';

export async function createProducts(subCategory, existingSubCategory) {
    for (const product of subCategory.produits || []) {
        // Vérifiez si le produit existe déjà dans la sous-catégorie existante
        const existingProduct = await prisma.produit.findFirst({
            where: {
                name: product.name,
                categorieId: existingSubCategory.id, // Utilisation de `categorieId` (ex-sousCategorieId)
            },
        });

        if (!existingProduct) {
            try {
                // Génération d'un slug unique pour le produit
                const productSlug = generateSlug(product.name);
                // Définition du chemin de l'image
                const imagePath = `/img/product/${productSlug}.webp`;

                // Création du produit avec son image associée
                await prisma.produit.create({
                    data: {
                        name: product.name,
                        slug: productSlug,
                        description: product.description,
                        prix: product.price,
                        categorie: {

                            connect: {
                                id: existingSubCategory.id // Connexion à la sous-catégorie existante
                            },
                        },
                        image: {
                            create: {
                                path: imagePath, // Utilisation du chemin d'image dynamique
                            },
                        },
                    },
                });

                console.log(`Produit ${product.name} ajouté sous ${subCategory.name}`);
            } catch (error) {
                console.error(`Erreur lors de la création du produit ${product.name}:`, error);
            }
        } else {
            console.log(`Le produit ${product.name} existe déjà sous ${subCategory.name}`);
        }
    }
}
