'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: number;
  produit: {
    id: number;
    name: string;
    prix: number;
    description: string;
    image: { path: string };
  };
  quantite: number;
  prix: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('sessionId', sessionId);
    }

    setSessionId(sessionId);
    return sessionId;
  }
  useEffect(() => {
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
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchCart();
  }, []);

  useEffect(() => {
    console.log("CartItems updated:", cartItems);
  }, [cartItems]);
  
  const handleRemove = async (itemId: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.produit.id !== itemId)
        );
        console.log("Article supprimé et panier mis à jour localement.");
      } else {
        console.error("Erreur lors de la suppression de l'article:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };
  
  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, sessionId }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
      
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.produit.id === updatedItem.fk_produit
              ? { ...item, quantite: updatedItem.quantite, prix: updatedItem.prix }
              : item
          )
        );
      
      } else {
        console.error("Erreur lors de la mise à jour de la quantité:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  if (loading) return <div>Chargement du panier...</div>;

  return (
    <div className="bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <img src={item.produit.image.path} alt={item.produit.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.produit.name}</h3>
                <p className="text-gray-500">{item.produit.description}</p>
                <p className="mt-2">{item.prix}€ x {item.quantite}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite - 1)}
                  disabled={item.quantite <= 1}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantite}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.produit.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          <div className="text-xl font-bold text-right">Total: {totalAmount.toFixed(2)} €</div>
          <button
            onClick={() => router.push('/checkout')}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Passer à la caisse
          </button>
        </div>
      )}
    </div>
  );
}
