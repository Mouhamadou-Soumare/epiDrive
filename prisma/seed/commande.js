import prisma from "../../lib/prisma.js";
import { faker } from '@faker-js/faker';

export async function createCommandes() {
    const users = await prisma.user.findMany();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.id;

    const status = ['En attente', 'Annulé', 'En cours de livraison', 'Livré'];

    const commande = await prisma.commande.create({
        data: {
            status: status[Math.floor(Math.random() * status.length)],
            createdAt: faker.date.recent(),
            user: {
                connect: { id: userId },
            },
        },
    });
    
    console.log('Commande created:', commande);

    const products = await prisma.produit.findMany();
    const randomProducts = products.slice(0, 3); // Sélectionne 3 produits au hasard

    randomProducts.forEach(async (product) => {
        const quantiteCommande = await prisma.quantiteCommande.create({
            data: {
                commandeId: commande.id,
                produitId: product.id,
                quantite: Math.floor(Math.random() * 5) + 1,
                prix: product.prix
            },
        });

        console.log('CommandeProduct created:', quantiteCommande);
    });
}
