import { useState, useEffect } from "react";
import { CartItem } from "types";

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function useCartData() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart?sessionId=${getOrCreateSessionId()}`);
        const data = await res.json();
        if (res.ok) {
          setCartItems(data);
        } else {
          setError(data.error || "Erreur lors de la récupération du panier");
        }
      } catch (err) {
        setError("Erreur lors de la récupération du panier");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  return { cartItems, loading, error };
}