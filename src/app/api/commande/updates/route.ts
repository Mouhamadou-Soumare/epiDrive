// api/commande/updates/route.ts

import { NextRequest } from "next/server";

interface SSEClient {
  id: string;
  res: WritableStreamDefaultWriter<Uint8Array>;
}

let clients: SSEClient[] = [];

/**
 * Gère la connexion SSE pour les mises à jour des commandes.
 */
export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const clientId = crypto.randomUUID();

  clients.push({ id: clientId, res: writer });

  console.log(`🟢 Client SSE connecté: ${clientId}`);

  await writer.write(encoder.encode("data: Connexion établie\n\n"));

  req.signal.addEventListener("abort", () => {
    console.log(`🔴 Client SSE déconnecté: ${clientId}`);
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
 * Envoie une mise à jour des commandes à tous les clients SSE connectés.
 */
export async function sendCommandeUpdate(updatedCommande: any) {
  const encoder = new TextEncoder();
  clients.forEach(async (client) => {
    try {
      await client.res.write(
        encoder.encode(`data: ${JSON.stringify(updatedCommande)}\n\n`)
      );
    } catch (error) {
      console.error(` Erreur envoi SSE client ${client.id}:`, error);
    }
  });
}
