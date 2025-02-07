import { useEffect, useState, Fragment } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import useAddCart from "@/hooks/cart/useAddCart";
import IngredientList from "@/components/snap-and-cook/IngredientList";
import { Ingredient, Produit, Recette } from "../../../../types";

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

interface RecommendedRecettesProps {
  sessionId: string;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  allRecettes: Recette[];
}

const RecommendedRecettes: React.FC<RecommendedRecettesProps> = ({
  sessionId,
  setCartItems,
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

  /** 🔹 Ouvre la modal et stocke les produits de la recette */
  const openModal = (recette: Recette) => {
    setSelectedRecette(recette);
    setIsModalOpen(true);
  };

  /** 🔹 Ajoute un produit au panier */
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
    <div className="mx-auto max-w-2xl pt-8 px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
      <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
        Epidrive vous recommande
      </h2>

      {loading ? (
        <div className="flex justify-center mt-8">
          <p>Chargement des recommandations...</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {recommendedRecettes.map((recette) => (
            <div key={recette.id}>
              <div className="relative">
                <div className="relative h-72 w-full overflow-hidden rounded-lg mt-4">
                  <img alt={recette.title} src={recette.image}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="relative mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recette.title}
                  </h3>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    <h3 className="text-lg font-medium text-gray-900">
                      Liste des produits
                    </h3>
                    {recette.produits.map((produit: Produit) => (
                      <p key={produit.id}>{produit.name}</p>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Liste des ingrédients
                    </h3>
                    {recette.ingredients.map((ingredient: Ingredient) => (
                      <p key={ingredient.id}>{ingredient.name}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  onClick={() => openModal(recette)}
                >
                  Ajouter les produits disponibles au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour afficher les produits de la recette */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          {/* Overlay noir semi-transparent */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-800 mb-4">
                  Produits de la recette
                </Dialog.Title>

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
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RecommendedRecettes;
