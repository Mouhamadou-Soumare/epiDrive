import { useState } from "react";
import { randomBytes } from "crypto";

interface OrderItem {
  id: number;
  quantite: number;
  prix: number;
  image: string;
}

interface ShippingAddress {
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
}

interface OrderSummary {
  items: OrderItem[];
  totalAmount: number;
  livraisonType: string;
  shippingAddress: ShippingAddress;
}

export function useSaveOrder() {
  const [saving, setSaving] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const saveOrderToDatabase = async (
    orderSummary: OrderSummary,
    userId: string,
    userEmail: string,
    userName: string
  ) => {
    if (!orderSummary || !userId || !userEmail || orderSaved) {
      return;
    }

    try {
      setSaving(true);
      const produits = orderSummary.items.map((item) => ({
        id: item.id,
        quantite: item.quantite,
        prix: item.prix,
        image: item.image,
      }));

      const commande = {
        status: "EN_ATTENTE",
        type: orderSummary.livraisonType,
        paymentId: randomBytes(16).toString("hex"),
        userId,
        infosAdresse: orderSummary.shippingAddress,
        produits,
      };

      const response = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commande),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement de la commande");

      const data = await response.json();
      const commandeId = data.id;

      setOrderSaved(true);

      await sendOrderConfirmation(userName, "mouhamadou-soumare@hotmail.com", commandeId);
    } catch (error) {
      setError("Erreur lors de l'enregistrement de la commande.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const sendOrderConfirmation = async (userName: string, email: string, commandeId: number) => {
    try {
    email="mouhamadou-soumare@hotmail.com";
      const emailResponse = await fetch("/api/sendOrderConfirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, commandeId }),
      });
      console.log(email);

      if (!emailResponse.ok) {
        throw new Error("Erreur lors de l'envoi de l'email de confirmation");
      }
    } catch (error) {
      console.error("Erreur lors de la notification de l'utilisateur:", error);
    }
  };

  return { saveOrderToDatabase, saving, orderSaved, error };
}
