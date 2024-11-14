import prisma from "../../lib/prisma.js";
import { generateSlug } from './generateSlug.js';
import { faker } from '@faker-js/faker';


export async function createRecettes() {
    const fakerFood = faker.food;
    
    // Définition du chemin de l'image
    const imagePath = `/img/recette/${generateSlug(fakerFood.dish())}.webp`;
    const users = await prisma.user.findMany();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.id;



    const products = await prisma.produit.findMany();
    const randomProducts = products.slice(0, 3); // Sélectionne 3 produits au hasard

    const recette = await prisma.recette.create({
        data: {
            title: fakerFood.dish(),
            description: fakerFood.description(),
            instructions: fakerFood.ingredient(),
            image: imagePath,
            user: {
                connect: { id: userId },
            },
            produits: {
                connect: randomProducts.map((product) => ({ id: product.id })),
            }
        },
    });

    console.log('Recette created:', recette);
}
