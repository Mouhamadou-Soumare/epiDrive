import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète et la version de l'API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Route POST pour créer une session Stripe Checkout
export async function POST(req: Request) {
  try {
    // Récupérer et parser le corps de la requête
    const body = await req.json();
    const { produits, adresse, ville, codePostal, pays } = body;

    // Vérifier que la commande contient des produits
    if (!produits || produits.length === 0) {
      return NextResponse.json(
        { error: 'Aucun produit dans la commande' },
        { status: 400 }
      );
    }

    // Mapper les produits vers le format `line_items` attendu par Stripe
    const lineItems = produits.map((product: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100), // Convertir les euros en centimes
      },
      quantity: product.quantity,
    }));

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-cancel`,
      metadata: {
        adresse,
        ville,
        codePostal,
        pays,
      },
    });

    // Retourner l'URL de la session Stripe
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    // Gérer les erreurs et retourner un message d'erreur au client
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error.message },
      { status: 500 }
    );
  }
}
