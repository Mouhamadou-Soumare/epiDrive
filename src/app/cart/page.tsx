"use client";

import RecommendedRecettes from "@/components/client/recette/RecommendedRecettes";
import AuthModal from "@/components/AuthModal";
import LoaderComponent from "@/components/LoaderComponent";
import { useCartPage } from "@/hooks/cart/useCartPage";

export default function CartPage() {
  const {
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
  } = useCartPage();

  if (loading) return <LoaderComponent />;

  return (
    <div className="bg-white p-8 mx-auto px-56">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
      {localCart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide</p>
      ) : (
        <div className="space-y-4">
          {localCart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between border-b pb-4"
            >
              <img
                src={item.produit.image.path}
                alt={item.produit.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.produit.name}</h3>
                <p className="text-gray-500">{item.produit.description}</p>
                <p className="mt-2">
                  {item.prix}€ x {item.quantite}
                </p>
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

          <div className="text-xl font-bold text-right">
            Total: {totalAmount.toFixed(2)} €
          </div>

         
          {status === "authenticated" ? (
            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 button-primary hover:bg-orange-500 py-2 px-10 rounded-lg"
            >
              Passer à la caisse
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-4 button-primary hover:bg-orange-500 py-2 px-10 rounded-lg"
            >
              Se connecter pour passer à la caisse
            </button>
          )}

<div className="mt-2">
            <button
              onClick={() => setShowRecommendedRecettes(!showRecommendedRecettes)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 py-2 px-10 rounded-lg text-white"
            >
              {showRecommendedRecettes
                ? "Masquer les recettes recommandées"
                : "Voir les recettes recommandées"}
            </button>

            {showRecommendedRecettes &&
              (isLoadingRecettes ? (
                <div className="text-center mt-4">Chargement des recettes...</div>
              ) : recommendedRecettes.length === 0 ? (
                <div className="text-center mt-4">Aucune recette recommandée</div>
              ) : (
                <RecommendedRecettes allRecettes={recommendedRecettes} />
              ))}
          </div>


          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      )}
    </div>
  );
}