import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("📢 API /categories: Début du traitement...");

    // Vérifier si Prisma est bien initialisé
    if (!prisma) {
      console.error("❌ Prisma Client n'est pas initialisé correctement.");
      return NextResponse.json({ error: "Erreur interne du serveur: Prisma Client non initialisé." }, { status: 500 });
    }

    console.log("🛠 Récupération des catégories depuis la base de données...");

    // Récupération des catégories avec sous-catégories et images
    const categories = await prisma.categorie.findMany({
      include: {
        image: true,
        subcategories: {
          include: {
            image: true,
          },
        },
      },
    });

    console.log(`✅ Récupération réussie : ${categories.length} catégories trouvées.`);

    if (categories.length === 0) {
      console.warn("⚠️ Aucune catégorie trouvée.");
      return NextResponse.json({ error: "Aucune catégorie trouvée." }, { status: 404 });
    }

    // Formattage des catégories
    const formattedCategories = categories.map((
      categorie: {
        id: number,
        name: string,
        slug: string,
        parentId: number | null,
        image: { path: string } | null,
        subcategories: {
          id: number,
          name: string,
          slug: string,
          parentId: number | null,
          image: { path: string } | null
        }[]
      }
    ) => ({
      id: categorie.id,
      name: categorie.name,
      slug: categorie.slug,
      parentId: categorie.parentId || null, // Ajout du parentId pour la catégorie principale
      imageSrc: categorie.image?.path || 'https://via.placeholder.com/300',
      imageAlt: `Image de la catégorie ${categorie.name}`,
      subcategories: categorie.subcategories.map(subcategorie => ({
        id: subcategorie.id,
        name: subcategorie.name,
        slug: subcategorie.slug,
        parentId: subcategorie.parentId || null, // Ajout du parentId pour chaque sous-catégorie
        imageSrc: subcategorie.image?.path || 'https://via.placeholder.com/300',
        imageAlt: `Image de la sous-catégorie ${subcategorie.name}`,
      })),
    }));

    console.log("✅ Catégories formatées avec succès.");
    
    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error: any) {
    console.error("❌ ERREUR DANS API /categories:", error);

    let errorMessage = "Erreur inconnue.";
    
    // Erreur Prisma spécifique
    if (error instanceof Error) {
      if (error.message.includes("P2021")) {
        errorMessage = "La table demandée dans la base de données est introuvable.";
      } else if (error.message.includes("P2002")) {
        errorMessage = "Conflit de clé unique dans la base de données.";
      } else if (error.message.includes("P1001")) {
        errorMessage = "Connexion à la base de données échouée. Vérifiez DATABASE_URL.";
      } else {
        errorMessage = `Erreur Prisma: ${error.message}`;
      }
    }

    return NextResponse.json({ error: `Échec de la récupération des catégories: ${errorMessage}` }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const body = await req.json();
  
  const { name, description, parentId, path } = body;

  try {
    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-');
  
    const newcategorie = await prisma.categorie.create({
      data: {
        name: name,
        description: description,
        slug: slug,
        parentId: parentId ? parseInt(body.parentId.toString()) : null,
      },
    });

    if (path) {
      const newImage = await prisma.image.create({
        data: {
          path: body.path
        },
      });

      await prisma.categorie.update({
        where: { id: newcategorie.id },
        data: {
          imageId: newImage.id,
        },
      });

    }

    return NextResponse.json(newcategorie, { status: 201 });
  } catch (error) {
      console.error("Error in POST API/categorie:", error);
      return new Response(JSON.stringify({ error: 'Failed to create categorie' }), { status: 500 });
  }
}
