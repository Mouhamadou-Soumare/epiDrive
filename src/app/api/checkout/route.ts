import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Définition des types des produits et du corps de la requête
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutBody {
  produits: Product[];
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
}

// Initialiser Stripe avec la clé secrète et la version de l'API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

// Route POST pour créer une session Stripe Checkout
export async function POST(req: Request) {
  try {
    const body: CheckoutBody = await req.json();
    const { produits, adresse, ville, codePostal, pays } = body;

    if (!produits || produits.length === 0) {
      return NextResponse.json(
        { error: 'Aucun produit dans la commande' },
        { status: 400 }
      );
    }

    const lineItems = produits.map((product) => {
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
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      return NextResponse.json(
        { error: 'Erreur interne du serveur', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
