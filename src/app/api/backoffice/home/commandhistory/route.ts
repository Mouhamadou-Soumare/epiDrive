import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const groupBy = url.searchParams.get("groupBy") || "day"; // Par défaut, on groupe par jour

    // Définition du format de regroupement par date
    let dateFormat: string;
    switch (groupBy) {
      case "week":
        dateFormat = `%Y-%u`; // Semaine de l'année
        break;
      case "month":
        dateFormat = `%Y-%m`; // Mois de l'année
        break;
      case "day":
      default:
        dateFormat = `%Y-%m-%d`; // Jour précis
        break;
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Fonction pour envoyer les mises à jour en temps réel
    const sendUpdate = async () => {
      try {
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

        // Sérialisation des données pour éviter les problèmes avec les BigInt
        const serializedData = commandHistory.map((row) => ({
          ...row,
          count: typeof row.count === "bigint" ? row.count.toString() : row.count,
        }));

        writer.write(encoder.encode(`data: ${JSON.stringify(serializedData)}\n\n`));
      } catch (queryError) {
        console.error("Erreur lors de la récupération des données:", queryError);
      }
    };

    await sendUpdate(); // Envoi initial

    // Envoi des mises à jour toutes les 5 secondes
    const intervalId = setInterval(sendUpdate, 5000);

    // Gestion de l'arrêt de la connexion SSE
    req.signal.addEventListener("abort", () => {
      clearInterval(intervalId);
      writer.close();
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données SSE:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
