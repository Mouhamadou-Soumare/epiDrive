import { NextRequest } from "next/server";

interface Client {
  id: string;
  res: WritableStreamDefaultWriter<Uint8Array>;
}

let clients: Client[] = [];

/**
 * Établit une connexion SSE pour écouter les mises à jour du panier.
 */
export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const clientId = crypto.randomUUID();
  clients.push({ id: clientId, res: writer });

  console.log(`Client connecté : ${clientId}`);

  await writer.write(encoder.encode("data: Connexion établie\n\n"));

  req.signal.addEventListener("abort", () => {
    console.log(`Client déconnecté : ${clientId}`);
    clients = clients.filter((client) => client.id !== clientId);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * Diffuse les mises à jour du panier à tous les clients connectés via SSE.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.cart) {
      return new Response(
        JSON.stringify({ error: "Aucune donnée de panier reçue" }),
        { status: 400 }
      );
    }

    console.log(`Mise à jour du panier reçue :`, body.cart);

    const message = `data: ${JSON.stringify(body.cart)}\n\n`;
    const encoder = new TextEncoder();

    // Envoi des mises à jour à tous les clients connectés
    clients.forEach(async (client) => {
      try {
        await client.res.write(encoder.encode(message));
      } catch (error) {
        console.error(`Erreur d'envoi au client ${client.id}:`, error);
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}
