import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Récupère un log spécifique par ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logId = parseInt(id, 10);

  if (!id || isNaN(logId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const log = await prisma.log.findUnique({
      where: { id: logId },
      include: { user: true },
    });

    if (!log) {
      return NextResponse.json({ error: "Log introuvable" }, { status: 404 });
    }

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du log :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Supprime un log spécifique par ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logId = parseInt(id, 10);

  if (!id || isNaN(logId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const log = await prisma.log.findUnique({ where: { id: logId } });

    if (!log) {
      return NextResponse.json({ error: "Log introuvable" }, { status: 404 });
    }

    await prisma.log.delete({ where: { id: logId } });

    return NextResponse.json(
      { message: "Log supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Erreur lors de la suppression du log :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
