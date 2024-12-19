import { useEffect, useState } from "react";
import React from "react";
import useAddCart from "@/hooks/cart/useAddCart";

import { Produit, Recette } from "../../../../types";

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

  useEffect(() => {
    if (allRecettes.length > 0) {
      setRecommendedRecettes(allRecettes);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [allRecettes]);

  const handleUpdateCart = (recette: Recette) => {
    return () => {
      setCartItems((prevItems) => {
        const updatedCart = [...prevItems];

        
        recette.produits.forEach((produit: Produit) => {
          const existingProductIndex = updatedCart.findIndex(
            (item) => item.produit.id === produit.id
          );

          if (existingProductIndex > -1) {
            return;
          } else {
            // Ajouter un nouveau produit au panier
            updatedCart.push({
              id: produit.id, // Utilisation de l'ID du produit
              produit: {
                id: produit.id,
                name: produit.name,
                prix: produit.prix,
                description: produit.description,
                image: { path: produit.image?.path || "" },
              },
              quantite: 1,
              prix: produit.prix,
            });
          }

          // Appel à l'API pour synchroniser avec le serveur
          addToCart({
            productId: produit.id,
            quantity: 1,
            price: produit.prix,
          });
        });

        return updatedCart;
      });
    };
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
                  <img
                    alt={recette.title}
                    src={recette.image}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="relative mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recette.title}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Produits/ingrédients de la recette
                </h3>
                <ul>
                  {recette?.produits?.map((produit) => (
                    <li key={produit.id} className="text-sm text-gray-500">
                      {produit.name}
                    </li>
                  ))}
                  {recette?.ingredients?.map((ingredient, index) => (
                    <li
                      key={`ingredient-${index}`}
                      className="text-sm text-gray-500"
                    >
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  onClick={handleUpdateCart(recette)}
                >
                  Ajouter les produits disponibles au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedRecettes;
