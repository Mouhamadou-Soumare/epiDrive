import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

import { generateSlug } from './seed/generateSlug.mjs';
import { categories } from './seed/categories.mjs';
import { createSubcategories } from './seed/subcategories.mjs';
import { createUsers } from './seed/users.mjs';
import { createRecettes } from './seed/recette.mjs';
import { createCommandes } from './seed/commande.mjs';
import { createPanier } from './seed/panier.mjs';

async function main() {
    try {
        await prisma.$connect();
        console.log('Connecté à la base de données.');

        await createUsers();

        for (const category of categories) {
            const slug = generateSlug(category.title);

            const existingCategory = await prisma.categorie.findUnique({
                where: { slug },
            });

            if (!existingCategory) {
                const parentCategory = await prisma.categorie.create({
                    data: {
                        name: category.title,
                        slug,
                        description: category.description || null,
                        image: {
                            create: {
                                path: `/img/category/${slug}.webp` || "default-image-path.jpg",
                            },
                        },
                    },
                });

                console.log(`Catégorie ${parentCategory.name} créée`);
                await createSubcategories(category, parentCategory);
            } else {
                console.log(`La catégorie ${category.title} existe déjà.`);
                await createSubcategories(category, existingCategory);
            }
        }

        for (let i = 0; i < 22; i++) {
            await createRecettes();
            await createPanier();
        }
        
        for (let i = 0; i < 5; i++) {
            await createCommandes();
        }

    } catch (e) {
        console.error('Erreur lors de la création des données :', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
