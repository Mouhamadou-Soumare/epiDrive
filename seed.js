import {
    PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const categories = [{
        title: 'Produits régionaux et locaux',
        description: 'Découvrez les produits authentiques de nos régions, avec une traçabilité complète pour vous garantir le meilleur de chez nous.',
        subcategories: [{
                name: 'Fruits de nos régions',
                slug: 'fruits-de-nos-regions',
                produits: [{
                        name: 'Pommes de Normandie',
                        description: 'Pommes fraîches et croquantes issues des vergers de Normandie.',
                        price: 3.99,
                    },
                    {
                        name: 'Poires du Limousin',
                        description: 'Poires juteuses et sucrées, parfaites pour les desserts.',
                        price: 4.50,
                    },
                ],
            },
            {
                name: 'Fromages de nos régions',
                slug: 'fromages-de-nos-regions',
                produits: [{
                        name: 'Camembert de Normandie',
                        description: 'Camembert au lait cru, produit selon la tradition Normande.',
                        price: 5.99,
                    },
                    {
                        name: 'Roquefort AOP',
                        description: 'Roquefort AOP, fromage à pâte persillée produit en Aveyron.',
                        price: 7.50,
                    },
                ],
            },
            {
                name: 'Vins régionaux',
                slug: 'vins-regionaux',
                produits: [{
                        name: 'Bordeaux Supérieur',
                        description: 'Vin rouge, parfait pour accompagner des viandes et fromages.',
                        price: 12.99,
                    },
                    {
                        name: 'Sancerre Blanc',
                        description: 'Vin blanc sec, idéal avec des fruits de mer et du poisson.',
                        price: 14.99,
                    },
                ],
            },
        ],
    },
    {
        title: 'Marché frais',
        subcategories: [{
                name: 'Fruits et Légumes',
                slug: 'fruits-et-legumes',
                description: 'Les meilleurs produits de saison directement de nos producteurs.',
                produits: [{
                        name: 'Pommes Bio',
                        description: 'Pommes fraîches et biologiques issues de nos producteurs locaux.',
                        price: 3.49,
                    },
                    {
                        name: 'Carottes de saison',
                        description: 'Carottes fraîches et croquantes, cultivées sans pesticides.',
                        price: 2.99,
                    },
                ],
            },
            {
                name: 'Viandes et Poissons',
                slug: 'viandes-et-poissons',
                description: 'Sélection de viandes locales et poissons frais pour tous vos repas.',
                produits: [{
                        name: 'Poulet Fermier',
                        description: 'Poulet fermier élevé en plein air, tendre et savoureux.',
                        price: 12.99,
                    },
                    {
                        name: 'Saumon Atlantique',
                        description: 'Saumon frais de l’Atlantique, idéal pour les grillades.',
                        price: 19.99,
                    },
                ],
            },
            {
                name: 'Pains et Pâtisseries',
                slug: 'pains-et-patisseries',
                description: 'Le plaisir du bon pain et des pâtisseries maison tous les jours.',
                produits: [{
                        name: 'Baguette Tradition',
                        description: 'Baguette de pain croustillante cuite sur place chaque jour.',
                        price: 1.20,
                    },
                    {
                        name: 'Croissant Beurre',
                        description: 'Croissant au beurre fait maison, idéal pour le petit-déjeuner.',
                        price: 1.50,
                    },
                ],
            },
            {
                name: 'Crèmerie et Produits laitiers',
                slug: 'cremerie-et-produits-laitiers',
                description: 'Tous les produits laitiers pour une fraîcheur garantie.',
                produits: [{
                        name: 'Lait Demi-écrémé',
                        description: 'Lait frais demi-écrémé, directement de la ferme.',
                        price: 1.50,
                    },
                    {
                        name: 'Yaourt Nature Bio',
                        description: 'Yaourt nature bio, fabriqué à partir de lait frais.',
                        price: 0.99,
                    },
                ],
            },
            {
                name: 'Charcuterie et Traiteur',
                slug: 'charcuterie-et-traiteur',
                description: 'Une sélection de charcuterie et plats traiteur à savourer.',
                produits: [{
                        name: 'Jambon de Pays',
                        description: 'Jambon de pays affiné, tranché fin pour un goût intense.',
                        price: 4.99,
                    },
                    {
                        name: 'Terrine de Campagne',
                        description: 'Terrine de campagne traditionnelle, idéale pour vos entrées.',
                        price: 6.50,
                    },
                ],
            },
        ],
    },

    {
        title: 'Bio et Ecologie',
        description: 'Un large choix de produits respectueux de l’environnement, pour une consommation plus responsable.',
        subcategories: [{
                name: 'Fruits et Légumes Bio',
                slug: 'fruits-et-legumes-bio',
                produits: [{
                        name: 'Carottes Bio',
                        description: 'Carottes bio cultivées sans pesticides.',
                        price: 2.99,
                    },
                    {
                        name: 'Tomates Bio',
                        description: 'Tomates biologiques, fraîches et juteuses.',
                        price: 3.49,
                    },
                ],
            },
            {
                name: 'Viandes Bio',
                slug: 'viandes-bio',
                produits: [{
                        name: 'Poulet Bio',
                        description: 'Poulet fermier biologique, élevé en plein air.',
                        price: 14.99,
                    },
                    {
                        name: 'Bœuf Bio',
                        description: 'Viande de bœuf bio, idéale pour les grillades.',
                        price: 22.50,
                    },
                ],
            },
            {
                name: 'Produits laitiers Bio',
                slug: 'produits-laitiers-bio',
                produits: [{
                        name: 'Lait Bio',
                        description: 'Lait biologique demi-écrémé, 100% naturel.',
                        price: 1.80,
                    },
                    {
                        name: 'Yaourt Bio',
                        description: 'Yaourt nature biologique, sans additifs.',
                        price: 0.99,
                    },
                ],
            },
            {
                name: 'Boissons Bio',
                slug: 'boissons-bio',
                produits: [{
                        name: 'Jus de pomme Bio',
                        description: 'Jus de pomme bio, sans sucres ajoutés.',
                        price: 3.50,
                    },
                    {
                        name: 'Thé Vert Bio',
                        description: 'Thé vert biologique, récolté dans des fermes durables.',
                        price: 4.99,
                    },
                ],
            },

        ],
    },
];

function generateSlug(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^\w\-]+/g, ''); 
  }

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
                    children: {
                        create: category.subcategories?.map((subCategory) => ({
                            name: subCategory.name,
                            slug: subCategory.slug,
                            description: subCategory.description,
                            produits: {
                                create: subCategory.produits?.map((product) => ({
                                    name: product.name,
                                    slug: generateSlug(product.name),
                                    description: product.description,
                                    price: product.price,
                                })),
                            },
                        })),
                    },
                },
            });
            console.log(`Catégorie et produits créés pour : ${parentCategory.name}`);
        } else {
            console.log(`La catégorie ${category.title} existe déjà.`);

            for (const subCategory of category.subcategories || []) {
                const existingSubCategory = await prisma.categorie.findFirst({
                    where: {
                        slug: subCategory.slug,
                        parentId: existingCategory.id,
                    },
                });

                if (!existingSubCategory) {
                    const createdSubCategory = await prisma.categorie.create({
                        data: {
                            name: subCategory.name,
                            slug: subCategory.slug,
                            description: subCategory.description,
                            parent: {
                                connect: {
                                    id: existingCategory.id
                                },
                            },
                            produits: {
                                create: subCategory.produits?.map((product) => ({
                                    name: product.name,
                                    slug: generateSlug(product.name), 
                                    description: product.description,
                                    price: product.price,
                                })),
                            },
                        },
                    });
                    console.log(`Sous-catégorie ${createdSubCategory.name} ajoutée sous ${category.title}`);
                } else {
                    console.log(`La sous-catégorie ${subCategory.name} existe déjà.`);

                    for (const product of subCategory.produits || []) {
                        const existingProduct = await prisma.produit.findFirst({
                            where: {
                                name: product.name,
                                categorieId: existingSubCategory.id,
                            },
                        });

                        if (!existingProduct) {
                            await prisma.produit.create({
                                data: {
                                    name: product.name,
                                    slug: generateSlug(product.name), 
                                    description: product.description,
                                    price: product.price,
                                    categorie: {
                                        connect: {
                                            id: existingSubCategory.id
                                        },
                                    },
                                },
                            });
                            console.log(`Produit ${product.name} ajouté sous ${subCategory.name}`);
                        } else {
                            console.log(`Le produit ${product.name} existe déjà sous ${subCategory.name}`);
                        }
                    }
                }
            }
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