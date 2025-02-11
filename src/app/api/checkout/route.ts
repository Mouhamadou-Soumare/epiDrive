import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

/**
 * 📌 Crée une session de paiement Stripe
 */
export async function POST(req: Request) {
  try {
    const { orderSummary } = await req.json();

    if (!orderSummary?.items?.length) {
      return NextResponse.json({ error: "Aucun produit dans la commande" }, { status: 400 });
    }

    const lineItems = orderSummary.items.map(({ name, price, quantity }) => {
      if (typeof price !== "number" || price <= 0 || typeof quantity !== "number" || quantity <= 0) {
        throw new Error(`Produit invalide : ${JSON.stringify({ name, price, quantity })}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: { name },
          unit_amount: Math.round(price * 100), 
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-cancel`,
      metadata: {
        adresse: orderSummary.shippingAddress.adresse,
        ville: orderSummary.shippingAddress.ville,
        codePostal: orderSummary.shippingAddress.codePostal,
        pays: orderSummary.shippingAddress.pays,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(" Erreur lors de la création de la session Stripe :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
