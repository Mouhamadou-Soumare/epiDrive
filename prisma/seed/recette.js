import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';
import { faker } from '@faker-js/faker';

export async function createRecettes() {
    const fakerFood = faker.food;

    // Vérification des utilisateurs disponibles
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.error("Aucun utilisateur trouvé. Veuillez en créer avant de générer des recettes.");
        return;
    }

    // Sélection aléatoire d'un utilisateur
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.id;

    // Vérification des produits disponibles
    const products = await prisma.produit.findMany();
    if (products.length < 3) {
        console.error("Pas assez de produits disponibles. Veuillez en créer au moins 3 avant de générer des recettes.");
        return;
    }

    // Sélection de 3 produits aléatoires
    const randomProducts = faker.helpers.arrayElements(products, 3);

    // Génération des données de recette
    const recetteData = {
        title: fakerFood.dish(),
        description: faker.lorem.sentences(2),
        instructions: faker.lorem.sentences(2),
        image: `/img/recette/${generateSlug(fakerFood.dish())}.webp`,
        user: {
            connect: { id: userId },
        },
        produits: {
            connect: randomProducts.map((product) => ({ id: product.id })),
        },
    };

    // Création de la recette
    const recette = await prisma.recette.create({ data: recetteData });

    console.log("Recette créée :", recette);
}
