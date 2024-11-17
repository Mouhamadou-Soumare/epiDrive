import { prisma } from "../../lib/prisma"; 

interface QuantitePanier {
  id: number;
  produitId: number;
  quantite: number;
}

export class CartService {
  static async addToCart(userId: number, produitId: number, quantite: number) {
    try {
      let panier = await prisma.panier.findUnique({
        where: { userId },
        include: {
          produits: true, 
        },
      });

      if (!panier) {
        panier = await prisma.panier.create({
          data: {
            user: { connect: { id: userId } },
          },
          include: {
            produits: true,
          },
        });
      }

      const existingProduct = panier.produits.find((item: QuantitePanier) => item.produitId === produitId);

      if (existingProduct) {
        await prisma.quantitePanier.update({
          where: { id: existingProduct.id },
          data: { quantite: existingProduct.quantite + quantite },
        });
      } else {
        const produit = await prisma.produit.findUnique({ where: { id: produitId } });
        if (!produit) {
          return { success: false, message: "Produit introuvable" };
        }

        await prisma.quantitePanier.create({
          data: {
            quantite,
            prix: produit.prix,
            produit: { connect: { id: produitId } },
            panier: { connect: { id: panier.id } },
          },
        });
      }

      return { success: true, message: 'Produit ajouté au panier avec succès' };
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      return { success: false, message: "Erreur lors de l'ajout au panier", error };
    }
  }
}
