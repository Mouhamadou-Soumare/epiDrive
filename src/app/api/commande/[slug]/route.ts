// api/commande/[slug]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { sendCommandeUpdate } from "../updates/route";

/**
 * Récupère une commande par son ID (slug)
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug requis" }, { status: 400 });

    const commande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
      include: { quantites: { include: { produit: true } }, livraison: true },
    });

    return commande
      ? NextResponse.json(commande)
      : NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

/**
 * Met à jour une commande (statut & livraison)
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug requis" }, { status: 400 });

    const { status, livraison } = await req.json();

    const existingCommande = await prisma.commande.findUnique({
      where: { id: parseInt(slug) },
      include: { livraison: true },
    });

    if (!existingCommande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

    const updatedCommande = await prisma.commande.update({
      where: { id: parseInt(slug) },
      data: { status },
    });

    if (livraison && existingCommande.livraison) {
      await prisma.livraison.update({
        where: { id: existingCommande.livraison.id },
        data: { ...livraison },
      });
    }

    // 🔔 Notifier les clients SSE de la mise à jour
    await sendCommandeUpdate(updatedCommande);

    return NextResponse.json(updatedCommande);
  } catch (error) {
    console.error(" Erreur lors de la mise à jour de la commande :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}


/**
 * Supprime une commande
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug requis" }, { status: 400 });

    const commandeId = parseInt(slug, 10);

    const existingCommande = await prisma.commande.findUnique({
      where: { id: commandeId },
      include: { quantites: true, livraison: true },
    });

    if (!existingCommande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

    // Suppression des quantités associées
    if (existingCommande.quantites.length > 0) {
      await prisma.quantiteCommande.deleteMany({ where: { fk_commande: commandeId } });
    }

    // Suppression des informations de livraison si présentes
    if (existingCommande.livraison) {
      await prisma.livraison.delete({ where: { id: existingCommande.livraison.id } });
    }

    // Suppression de la commande
    await prisma.commande.delete({ where: { id: commandeId } });

    return NextResponse.json({ message: "Commande supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error(" Erreur lors de la suppression de la commande :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
