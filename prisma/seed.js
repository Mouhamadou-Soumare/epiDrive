import { generateSlug } from './seed/generateSlug.js';
import { categories } from './seed/categories.js';
import { createSubcategories } from './seed/subcategories.js';
import { createUsers } from './seed/users.js';
import { createRecettes } from './seed/recette.js';
import { createCommandes } from './seed/commande.js';
import prisma from '../lib/prisma.js';


const prisma = new PrismaClient();

export default prisma; // Export par défaut


async function main() {
    try {
        // Connecter à la base de données Prisma
        await prisma.$connect();
        console.log('Connecté à la base de données.');

        // Appeler les fonctions de seed
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
                                path: `/img/category/${slug}.webp` || "default-image-path.jpg", // Utilise l'image spécifiée ou une image par défaut
                            }
                        }
                    }
                });

                console.log(`Catégorie ${parentCategory.name} créée`);
                await createSubcategories(category, parentCategory);
            } else {
                console.log(`La catégorie ${category.title} existe déjà.`);
                await createSubcategories(category, existingCategory);
            }
        }

        // Appeler d'autres fonctions de seed
        await createRecettes();
        await createCommandes();
    } catch (e) {
        console.error('Erreur lors de la création des données :', e);
        process.exit(1);
    } finally {
        // Déconnecter Prisma
        await prisma.$disconnect();
    }
}

main();
