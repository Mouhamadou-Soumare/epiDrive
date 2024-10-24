import { PrismaClient } from '@prisma/client';
import { generateSlug } from './seed/generateSlug.js';
import { categories } from './seed/categories.js';
import { createSubcategories } from './seed/subcategories.js';

const prisma = new PrismaClient();

async function main() {
    for (const category of categories) {
        const slug = generateSlug(category.title);

        const existingCategory = await prisma.categorie.findUnique({
            where: {
                slug
            },
        });

        if (!existingCategory) {
            const parentCategory = await prisma.categorie.create({
                data: {
                    name: category.title,
                    slug,
                    description: category.description || null,
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

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
