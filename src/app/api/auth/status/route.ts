import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]'; // Importer les options d'auth NextAuth

export async function GET() {
  try {
    // Obtenez la session de l'utilisateur
    const session = await getServerSession(authOptions);

    // Vérifiez si une session existe
    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: session.user, // Inclure les informations de l'utilisateur
      });
    } else {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
