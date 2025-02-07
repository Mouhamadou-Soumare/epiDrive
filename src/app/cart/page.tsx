"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecommendedRecettes from "@/components/client/recette/RecommendedRecettes";
import { Recette } from "../../../types";
import AuthModal from "@/components/AuthModal";

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
  const { status } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingRecettes, setIsLoadingRecettes] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recommendedRecettes, setRecommendedRecettes] = useState<Recette[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecommendedRecettes, setShowRecommendedRecettes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔹 Récupère l'ID de session (ou le crée si inexistant)
   */
  const getOrCreateSessionId = useCallback(() => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("sessionId", sessionId);
    }
    setSessionId(sessionId);
    return sessionId;
  }, []);

  /**
   * 🔹 Récupère le panier depuis l'API
   */
  const fetchCart = useCallback(async () => {
    const sessionId = getOrCreateSessionId();
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
    } finally {
      setLoading(false);
    }
  }, [getOrCreateSessionId]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Empêche les quantités négatives

    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity, sessionId }),
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

  const handleRemove = async (productId: number) => {
    try {
      const res = await fetch(`/api/cart/${productId}?sessionId=${sessionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Mettre à jour l'état local du panier après suppression
        setCartItems((prevItems) => prevItems.filter((item) => item.produit.id !== productId));
      } else {
        console.error("Erreur lors de la suppression de l'article:", res.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };
  
  /**
   * 🔹 Récupère les recettes recommandées
   */
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
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    console.log("Recette sélectionnée :", recommendedRecettes);
    if (showRecommendedRecettes) {
      fetchRecettes();
    }
  }, [showRecommendedRecettes]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  if (loading)
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center">
        <span className="loader-cate-prod"></span>
      </div>
    );

  return (
    <div className="bg-white p-8 mx-auto px-56">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border-b pb-4">
              <img src={item.produit.image.path} alt={item.produit.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.produit.name}</h3>
                <p className="text-gray-500">{item.produit.description}</p>
                <p className="mt-2">{item.prix}€ x {item.quantite}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite - 1)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md disabled:bg-gray-300"
                  disabled={item.quantite <= 1}
                >
                  -
                </button>
                <span className="font-semibold">{item.quantite}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite + 1)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.produit.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Supprimer
              </button>
            </div>
          ))}

          <div className="text-xl font-bold text-right">Total: {totalAmount.toFixed(2)} €</div>

          {/* 🔹 Bouton pour afficher les recettes recommandées */}
          <button
            onClick={() => setShowRecommendedRecettes(!showRecommendedRecettes)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 py-2 px-10 rounded-lg text-white"
          >
            {showRecommendedRecettes ? "Masquer les recettes recommandées" : "Voir les recettes recommandées"}
          </button>

          {/* 🔹 Affichage conditionnel des recettes recommandées */}
          {showRecommendedRecettes && sessionId && (
            <RecommendedRecettes sessionId={sessionId} setCartItems={setCartItems} allRecettes={recommendedRecettes} />
          )}

          <button onClick={() => router.push("/checkout")} className="mt-4 bg-orange-300 hover:bg-orange-500 py-2 px-10 rounded-lg">
            Passer à la caisse
          </button>

          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      )}
    </div>
  );
}
