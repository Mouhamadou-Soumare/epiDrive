import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handler GET avec TypeScript correctement défini
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const groupBy = url.searchParams.get('groupBy') || 'day';

    let dateFormat: string;
    switch (groupBy) {
      case 'week':
        dateFormat = `%Y-%u`; // Année et numéro de semaine
        break;
      case 'month':
        dateFormat = `%Y-%m`; // Année et mois
        break;
      case 'day':
      default:
        dateFormat = `%Y-%m-%d`; // Par défaut, on regroupe par jour
        break;
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const sendUpdate = async () => {
      try {
        // Correction du typage de `commandHistory`
        const commandHistory: Array<{
          dateGroup: string;
          status: string;
          count: bigint | number;
        }> = await prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(createdAt, ${dateFormat}) AS dateGroup,
            status,
            COUNT(*) AS count
          FROM Commande
          GROUP BY dateGroup, status
          ORDER BY dateGroup ASC;
        `;

        // Conversion du type bigint en string si nécessaire
        const serializedData = commandHistory.map((row) => ({
          ...row,
          count: typeof row.count === 'bigint' ? row.count.toString() : row.count,
        }));

        writer.write(encoder.encode(`data: ${JSON.stringify(serializedData)}\n\n`));
      } catch (queryError) {
        console.error("Erreur lors de la récupération des données:", queryError);
      }
    };

    // Envoyer une première mise à jour immédiatement
    await sendUpdate();

    // Programmer des mises à jour toutes les 5 secondes
    const intervalId = setInterval(sendUpdate, 5000);

    // Gestion de l'annulation si la connexion est fermée
    req.signal.addEventListener('abort', () => {
      clearInterval(intervalId);
      writer.close();
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données SSE:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
