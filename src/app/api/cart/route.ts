import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SSEClient {
  id: string;
  res: WritableStreamDefaultWriter<Uint8Array>;
}

let clients: SSEClient[] = [];

/**
 * Gère la récupération du panier ou l'établissement d'une connexion SSE.
 */
export async function GET(req: NextRequest) {
  const { sessionId, userId, sse } = Object.fromEntries(new URL(req.url).searchParams);

  // Gestion des connexions SSE pour les mises à jour en temps réel
  if (sse === "true") {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const clientId = crypto.randomUUID();
    clients.push({ id: clientId, res: writer });

    console.log(` Client SSE connecté : ${clientId}`);

    await writer.write(encoder.encode("data: Connexion établie\n\n"));

    req.signal.addEventListener("abort", () => {
      console.log(`Client SSE déconnecté : ${clientId}`);
      clients = clients.filter(client => client.id !== clientId);
      writer.close();
    });

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  if (!sessionId && !userId) {
    return NextResponse.json({ error: "Session ID ou User ID requis" }, { status: 400 });
  }

  // Récupération du panier de l'utilisateur ou de la session
  const panier = await prisma.panier.findFirst({
    where: {
      fk_userId: userId ? parseInt(userId) : undefined,
      sessionId: sessionId ?? undefined,
    },
    include: {
      produits: {
        include: {
          produit: {
            select: { id: true, name: true, prix: true, description: true, image: true },
          },
        },
      },
    },
  });

  return NextResponse.json(panier?.produits || []);
}

/**
 * Ajoute un produit au panier et déclenche une mise à jour SSE.
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, quantity, sessionId, userId, update } = await req.json();

    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
    }

    const produit = await prisma.produit.findUnique({ where: { id: productId } });
    if (!produit) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    // Création ou récupération du panier existant
    const panier = await prisma.panier.upsert({
      where: {
        fk_userId: userId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
      create: {
        fk_userId: userId ?? undefined,
        sessionId: sessionId ?? undefined,
      },
      update: {},
    });

    // Ajout ou mise à jour du produit dans le panier
    const item = await prisma.quantitePanier.upsert({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: productId,
        },
      },
      create: {
        fk_produit: productId,
        fk_panier: panier.id,
        quantite: quantity,
        prix: produit.prix,
      },
      update: update
        ? { quantite: quantity }
        : { quantite: { increment: quantity } },
    });

    await sendCartUpdate(panier.id); // Notifie les clients SSE

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

/**
 * Met à jour la quantité d'un produit dans le panier
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId, quantity, sessionId, userId } = await req.json();

    if (!productId || !quantity || (!sessionId && !userId)) {
      return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
    }

    const panier = await prisma.panier.findFirst({
      where: {
        fk_userId: userId ? parseInt(userId, 10) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!panier) {
      return NextResponse.json({ error: "Panier non trouvé" }, { status: 404 });
    }

    const updatedItem = await prisma.quantitePanier.update({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: productId,
        },
      },
      data: { quantite: quantity },
    });

    await sendCartUpdate(panier.id); // Envoi mise à jour aux clients SSE

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la mise à jour du produit :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

/**
 * Supprime un produit du panier
 */
export async function DELETE(req: NextRequest) {
  try {
    const { productId, sessionId, userId } = Object.fromEntries(new URL(req.url).searchParams);

    if (!productId || (!sessionId && !userId)) {
      return NextResponse.json({ error: "Paramètres requis manquants" }, { status: 400 });
    }

    const panier = await prisma.panier.findFirst({
      where: {
        fk_userId: userId ? parseInt(userId, 10) : undefined,
        sessionId: sessionId ?? undefined,
      },
    });

    if (!panier) {
      return NextResponse.json({ error: "Panier non trouvé" }, { status: 404 });
    }

    await prisma.quantitePanier.delete({
      where: {
        fk_panier_fk_produit: {
          fk_panier: panier.id,
          fk_produit: parseInt(productId, 10),
        },
      },
    });

    await sendCartUpdate(panier.id); // Notifie la suppression aux clients SSE

    return NextResponse.json({ message: "Produit supprimé du panier" }, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la suppression du produit :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

/**
 * Envoie une mise à jour du panier aux clients SSE connectés
 */
async function sendCartUpdate(panierId: number) {
  const updatedCart = await prisma.quantitePanier.findMany({
    where: { fk_panier: panierId },
    include: { produit: true },
  });

  const encoder = new TextEncoder();
  clients.forEach(async (client) => {
    try {
      await client.res.write(encoder.encode(`data: ${JSON.stringify(updatedCart)}\n\n`));
    } catch (error) {
      console.error(`Erreur d'envoi au client ${client.id}:`, error);
    }
  });
}