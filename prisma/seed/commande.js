import prisma from "../../lib/prisma.js";
import { faker } from '@faker-js/faker';

export async function createCommandes() {
    // Vérification des utilisateurs disponibles
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.error("Aucun utilisateur trouvé. Veuillez en créer avant de générer des commandes.");
        return;
    }

    // Sélection aléatoire d'un utilisateur
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userId = randomUser.id;

    // Statuts possibles pour les commandes
    const status = ['EN_ATTENTE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

    // Vérification des produits disponibles
    const products = await prisma.produit.findMany();
    if (products.length < 3) {
        console.error("Pas assez de produits disponibles. Veuillez en créer au moins 3 avant de générer des commandes.");
        return;
    }

    // Sélection de 3 produits aléatoires
    const randomProducts = faker.helpers.arrayElements(products, 3);

    // Génération des données de livraison
    const livraisonData = {
        adresse: faker.address.streetAddress(),
        ville: faker.address.city(),
        codePostal: faker.address.zipCode(),
        pays: faker.address.country(),
        user: {
            connect: { id: userId },
        },
    };

    // Création de la commande avec livraison associée
    const commande = await prisma.commande.create({
        data: {
            status: faker.helpers.arrayElement(status),
            createdAt: faker.date.recent(),
            user: {
                connect: { id: userId },
            },
            livraison: {
                create: livraisonData,
            },
        },
        include: {
            livraison: true, // Inclut les informations de livraison
            quantites: true, // Inclut les produits associés
        },
    });

    console.log('Commande créée avec livraison :', commande);

    // Ajout des produits à la commande
    for (const product of randomProducts) {
        const quantiteCommande = await prisma.quantiteCommande.create({
            data: {
                commande: {
                    connect: { id: commande.id },
                },
                produit: {
                    connect: { id: product.id },
                },
                quantite: Math.floor(Math.random() * 5) + 1, // Quantité aléatoire entre 1 et 5
                prix: product.prix,
            },
        });

        console.log('Produit ajouté à la commande :', quantiteCommande);
    }
}
