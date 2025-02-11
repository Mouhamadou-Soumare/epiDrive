import prisma from "../../lib/prisma.mjs";
import { faker } from '@faker-js/faker';

export async function createCommandes() {
    // Vérification des utilisateurs disponibles
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.error("Aucun utilisateur trouvé. Veuillez en créer avant de générer des commandes.");
        return;
    }

    // Statuts possibles pour les commandes
    const status = ['EN_ATTENTE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

    // Statuts possibles pour les commandes
    const type = ['DOMICILE', 'DRIVE', 'EMPORTER'];
    
    // Vérification des produits disponibles
    const products = await prisma.produit.findMany();
    if (products.length < 3) {
        console.error("Pas assez de produits disponibles. Veuillez en créer au moins 3 avant de générer des commandes.");
        return;
    }

    // Dates limites pour les commandes
    const startDate = new Date("2024-11-14T00:00:00Z");
    const endDate = new Date();

    if (startDate >= endDate) {
        console.error("La date de début doit être avant la date de fin.");
        return;
    }

    for (let i = 0; i < 100; i++) {
        // Sélection aléatoire d'un utilisateur
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const userId = randomUser.id;

        // Sélection de 3 produits aléatoires
        const randomProducts = faker.helpers.arrayElements(products, 3);

        // Génération d'une date aléatoire
        const randomDate = faker.date.between({ from: startDate, to: endDate });

        // Génération des données de livraison
        const livraisonData = {
            adresse: faker.location.streetAddress(),
            ville: faker.location.city(),
            codePostal: faker.location.zipCode(),
            pays: faker.location.country(),
            user: {
                connect: { id: userId },
            },
        };
        

        // Création de la commande avec livraison associée
        const commande = await prisma.commande.create({
            data: {
                status: faker.helpers.arrayElement(status),
                type: faker.helpers.arrayElement(type),
                createdAt: randomDate,
                user: {
                    connect: { id: userId },
                },
                livraison: {
                    create: livraisonData,
                },
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
}
