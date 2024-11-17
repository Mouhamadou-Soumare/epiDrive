import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

import { generateSlug } from './seed/generateSlug.js';
import { categories } from './seed/categories.js';
import { createSubcategories } from './seed/subcategories.js';
import { createUsers } from './seed/users.js';
import { createRecettes } from './seed/recette.js';
import { createCommandes } from './seed/commande.js';

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

        await createRecettes();
        await createCommandes();
    } catch (e) {
        console.error('Erreur lors de la création des données :', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
