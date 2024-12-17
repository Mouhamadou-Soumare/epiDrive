import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('file') as File | null;

    // Simuler une mise à jour dans la base de données
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Fichier:', file?.name);

    // Logique de mise à jour dans une base de données fictive
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Nom et email sont requis.' },
        { status: 400 }
      );
    }

    // Ici, tu effectuerais la logique réelle pour enregistrer les données
    // Exemple : mise à jour utilisateur dans une base de données

    return NextResponse.json(
      { message: 'Profil mis à jour avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
