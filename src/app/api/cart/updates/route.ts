import { NextRequest } from 'next/server';

interface Client {
  id: string;
  res: WritableStreamDefaultWriter<Uint8Array>;
}

let clients: Client[] = [];

/**
 * Gère la connexion SSE pour les mises à jour du panier.
 */
export async function GET(req: NextRequest) {
  // Création d'un flux de réponse en lecture/écriture
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const clientId = crypto.randomUUID();
  const newClient: Client = { id: clientId, res: writer };
  clients.push(newClient);

  console.log(`👤 Client connecté : ${clientId}`);

  // Envoi du message de connexion
  await writer.write(encoder.encode("data: Connexion établie\n\n"));

  req.signal.addEventListener('abort', () => {
    console.log(`❌ Client déconnecté : ${clientId}`);
    clients = clients.filter(client => client.id !== clientId);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Reçoit une mise à jour du panier et l'envoie à tous les clients connectés.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.cart) {
      return new Response(JSON.stringify({ error: 'Aucune donnée de panier reçue' }), { status: 400 });
    }

    console.log(`🔄 Mise à jour du panier reçue :`, body.cart);

    const encoder = new TextEncoder();
    const message = `data: ${JSON.stringify(body.cart)}\n\n`;

    // Diffuser la mise à jour à tous les clients connectés
    clients.forEach(async (client) => {
      try {
        await client.res.write(encoder.encode(message));
      } catch (error) {
        console.error(`Erreur d'envoi au client ${client.id}:`, error);
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du panier:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
  }
}
