'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CartItem {
  productId: number;
  quantity: number;
  size?: string;
  price: number;
}

export default function useAddCart() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(storedSessionId);
    }
  }, []);

  const addToCart = async (item: CartItem) => {
    if (!sessionId) {
      console.error('Session ID non défini');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout au panier');
      }

      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert("Impossible d'ajouter le produit au panier");
    }
  };

  return { addToCart };
}
