import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function useAddToCart() {
  const { addToCart } = useCart();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleAddToCart = (id: number, quantity: number, prix: number, name: string) => {
    addToCart(id, quantity, prix);
    setConfirmationMessage(`Le produit "${name}" a été ajouté au panier (${quantity}x).`);

    setTimeout(() => setConfirmationMessage(null), 3000);
  };

  return { handleAddToCart, confirmationMessage };
}
