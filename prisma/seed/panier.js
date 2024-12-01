import prisma from "../../lib/prisma.js";
import { faker } from '@faker-js/faker';

export async function createPanier() {
    // Vérification des utilisateurs disponibles
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.error("Aucun utilisateur trouvé. Veuillez en créer avant de générer des paniers.");
        return;
    }

    // Sélection aléatoire d'un utilisateur
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.id;

    // Vérification des produits disponibles
    const products = await prisma.produit.findMany();
    if (products.length < 3) {
        console.error("Pas assez de produits disponibles. Veuillez en créer au moins 5 avant de générer des paniers.");
        return;
    }

    // Sélection de 3 produits aléatoires
    const randomProducts = faker.helpers.arrayElements(products, 3);

    // Génération des données du panier
    const panierData = {
        user: {
            connect: { id: userId },
        },
        produits: {
            create: randomProducts.map((product) => ({
                produit: {
                    connect: { id: product.id },
                },
                quantite: Math.floor(Math.random() * 10) + 1,
                prix: product.prix, // Utilise le prix du produit
            })),
        },
    };

    // Création du panier
    const panier = await prisma.panier.create({
        data: panierData,
        include: {
            produits: true, // Inclut les produits dans le retour
        },
    });

    console.log("Panier créé :", panier);
}
