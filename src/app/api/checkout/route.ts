import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète et la version de l'API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Route POST pour créer une session Stripe Checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { produits, adresse, ville, codePostal, pays } = body;

    if (!produits || produits.length === 0) {
      return NextResponse.json(
        { error: 'Aucun produit dans la commande' },
        { status: 400 }
      );
    }

    const lineItems = produits.map((product: any) => {
      if (
        typeof product.price !== 'number' ||
        product.price <= 0 ||
        typeof product.quantity !== 'number' ||
        product.quantity <= 0
      ) {
        throw new Error(`Produit invalide : ${JSON.stringify(product)}`);
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100), // Convertir en centimes
        },
        quantity: product.quantity,
      };
    });

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

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error.message },
      { status: 500 }
    );
  }
}

