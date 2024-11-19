import { NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

// Cette route est une route POST qui peut être appelée pour gérer l'authentification.
export async function POST(req: Request) {
  try {
    // Récupérer les données de la requête
    const body = await req.json();
    const { email } = body;

    // Appeler la fonction signIn de next-auth
    const result = await signIn('email', { redirect: false, email });

    if (result?.ok) {
      return NextResponse.json({ message: 'Connexion réussie', status: 'success' });
    } else {
      return NextResponse.json({ message: 'Échec de la connexion', status: 'error' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne du serveur', error: (error as any).message }, { status: 500 });
  }
}
