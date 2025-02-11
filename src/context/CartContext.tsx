"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
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

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  refreshCart: () => void;
  addToCart: (productId: number, quantity: number, price: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  deleteProduct: (productId: number) => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrCreateSessionId = useCallback(() => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }, []);

  /**
   * 🔄 Rafraîchit le panier depuis l'API
   */
  const refreshCart = useCallback(async () => {
    const sessionId = getOrCreateSessionId();
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("❌ Erreur récupération panier:", error);
    } finally {
      setLoading(false);
    }
  }, [getOrCreateSessionId]);

  /**
   * 🖥️ SSE: Mise à jour automatique du panier
   */
  useEffect(() => {
    refreshCart();
    const eventSource = new EventSource("/api/cart/updates");

    eventSource.onmessage = () => {
      console.log("📢 Mise à jour via SSE !");
      refreshCart();
    };

    return () => {
      eventSource.close();
    };
  }, [refreshCart]);

  /**
   * ➕ Ajoute un produit au panier avec mise à jour instantanée
   */
  const addToCart = async (productId: number, quantity: number, price: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.produit.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.produit.id === productId
            ? { ...item, quantite: item.quantite + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: productId,
          produit: { id: productId, prix: price, name: "Produit ajouté", description: "", image: { path: "" } },
          quantite: quantity,
          prix: price,
        },
      ];
    });

    await fetch(`/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, price, sessionId: getOrCreateSessionId() }),
    });

    refreshCart(); // Vérifie les données après l'API
  };

  /**
   * 🔄 Met à jour la quantité d'un produit
   */
  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      deleteProduct(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.produit.id === productId ? { ...item, quantite: newQuantity } : item
      )
    );

    await fetch(`/api/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity, sessionId: getOrCreateSessionId() }),
    });

    refreshCart();
  };

  /**
   * ❌ Supprime un produit du panier
   */
  const deleteProduct = async (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.produit.id !== productId));

    await fetch(`/api/cart/${productId}?sessionId=${getOrCreateSessionId()}`, {
      method: "DELETE",
    });

    refreshCart();
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, refreshCart, addToCart, updateQuantity, deleteProduct }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
