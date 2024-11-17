import { useEffect, useState } from 'react';

function getOrCreateSessionId() {
  const sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    const newSessionId = `session-${Date.now()}`;
    localStorage.setItem('sessionId', newSessionId);
    return newSessionId;
  }
  return sessionId;
}

type CartItem = {
  quantite: number;
  produit: any;
  prix: number;
  id: number;
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export function useGetCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        console.error('Erreur de récupération du panier:', data.error);
      }
    } catch (error: unknown) {
      let errorMessage = 'Erreur inconnue lors de la récupération du panier';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Erreur lors de la récupération du panier:', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  function refreshCart() {
    setLoading(true);
    fetchCart();
  }

  return { cartItems, loading, refreshCart };
}
