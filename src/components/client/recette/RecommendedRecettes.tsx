import { useEffect, useState, Fragment } from "react";
import React from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import useAddCart from "@/hooks/cart/useAddCart";
import IngredientList from "@/components/snap-and-cook/IngredientList";
import { Ingredient, Produit, Recette } from "../../../../types";
import foodImage from "../../../../public/img/food_recommended_recettes-removebg-preview.png";
import Image from "next/image";

interface RecommendedRecettesProps {
  allRecettes: Recette[];
}

const RecommendedRecettes: React.FC<RecommendedRecettesProps> = ({
  allRecettes,
}) => {
  const [recommendedRecettes, setRecommendedRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAddCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecette, setSelectedRecette] = useState<Recette | null>(null);
  const [cart, setCart] = useState<{ [productId: number]: number }>({});

  useEffect(() => {
    if (allRecettes.length > 0) {
      setRecommendedRecettes(allRecettes);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [allRecettes]);

  const openModal = (recette: Recette) => {
    setSelectedRecette(recette);
    setIsModalOpen(true);
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    const product = selectedRecette?.produits.find((p) => p.id === productId);
    if (!product) return;

    addToCart({
      productId,
      quantity,
      price: product.prix,
    });

    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + quantity,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl pt-16 px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
      <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
        Epidrive vous recommande
      </h2>

      {loading ? (
        <div className="flex justify-center mt-8">
          <p>Chargement des recommandations...</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-1 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {recommendedRecettes.map((recette) => (
          <div
            key={recette.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden transition transform hover:scale-105"
          >
            <div className="relative w-full h-48 bg-gray-200">
              {recette.image ? (
                <Image
                  src={foodImage}
                  alt={recette.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                   Pas d'image disponible
                </div>
              )}
            </div>
      
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{recette.title}</h3>
      
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-700">🛒 Produits :</h4>
                <ul className="mt-2 text-gray-600 text-sm space-y-1">
                  {recette.produits.map((produit: Produit) => (
                    <li key={produit.id} className="flex items-center">
                      {produit.name}
                    </li>
                  ))}
                </ul>
              </div>
      
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-700">🥕 Ingrédients :</h4>
                <ul className="mt-2 text-gray-600 text-sm space-y-1">
                  {recette.ingredients.map((ingredient: Ingredient) => (
                    <li key={ingredient.id} className="flex items-center">
                      🔹 {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
      
              <div className="mt-6">
                <button
                  className="w-full button-primary text-white font-semibold py-3 rounded-xl hover:bg-orange-700 transition"
                  onClick={() => openModal(recette)}
                >
                   Ajouter les produits disponibles au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-2xl font-semibold leading-6 text-gray-800 mb-4">
                  Produits de la recette
                </DialogTitle>

                {selectedRecette && (
                  <IngredientList
                    products={selectedRecette.produits}
                    cart={cart}
                    addToCart={handleAddToCart}
                    removeFromCart={(productId) =>
                      setCart((prev) => {
                        const newCart = { ...prev };
                        delete newCart[productId];
                        return newCart;
                      })
                    }
                    setIsModalOpen={setIsModalOpen}
                    setCart={setCart}
                  />
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
                >
                  Fermer
                </button>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RecommendedRecettes;
