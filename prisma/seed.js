import prisma from "../lib/prisma.js";
import { generateSlug } from './seed/generateSlug.js';
import { categories } from './seed/categories.js';
import { createSubcategories } from './seed/subcategories.js';
import {createUsers} from './seed/users.js';

async function main() {
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
                            path: `/img/category/${slug}.webp` || "default-image-path.jpg",  // Utilise l'image spécifiée ou une image par défaut
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
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
