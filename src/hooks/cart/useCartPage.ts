import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Recette } from "types";


export function useCartPage() {
  const { status } = useSession();
  const router = useRouter();

  const { cartItems, loading, updateQuantity, deleteProduct } = useCart();
  const [localCart, setLocalCart] = useState(cartItems);
  const updateTimeout = useRef<{ [key: number]: NodeJS.Timeout }>({});

  const [isLoadingRecettes, setIsLoadingRecettes] = useState(false);
  const [recommendedRecettes, setRecommendedRecettes] = useState<Recette[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecommendedRecettes, setShowRecommendedRecettes] = useState(false);

  useEffect(() => {
    if (localCart.length === 0) {
      setLocalCart(cartItems);
    }
  }, [cartItems]);

  const handleUpdateQuantity = useCallback(
    (productId: number, newQuantity: number) => {
      if (newQuantity < 1) {
        handleRemove(productId);
        return;
      }

      setLocalCart((prev) =>
        prev.map((item) =>
          item.produit.id === productId ? { ...item, quantite: newQuantity } : item
        )
      );

      if (updateTimeout.current[productId]) {
        clearTimeout(updateTimeout.current[productId]);
      }

      updateTimeout.current[productId] = setTimeout(() => {
        updateQuantity(productId, newQuantity);
      }, 300);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (productId: number) => {
      setLocalCart((prev) => prev.filter((item) => item.produit.id !== productId));
      deleteProduct(productId);
    },
    [deleteProduct]
  );

  const fetchRecettes = useCallback(async () => {
    if (cartItems.length === 0) return;
    setIsLoadingRecettes(true);
    try {
      const response = await fetch("/api/jimmy/recettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panier: cartItems }),
      });

      if (!response.ok) {
        console.error("Erreur lors de la récupération des recettes.");
        return;
      }

      const result = await response.json();
      setRecommendedRecettes(result.recipes);
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes:", error);
    } finally {
      setIsLoadingRecettes(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (showRecommendedRecettes) {
      fetchRecettes();
    }
  }, [showRecommendedRecettes, fetchRecettes]);

  const totalAmount = localCart.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0
  );

  return {
    status,
    router,
    localCart,
    loading,
    handleUpdateQuantity,
    handleRemove,
    totalAmount,
    showAuthModal,
    setShowAuthModal,
    showRecommendedRecettes,
    setShowRecommendedRecettes,
    isLoadingRecettes,
    recommendedRecettes,
  };
}
