"use client";

import { useState, Fragment } from "react";
import CameraCapture from "../../components/snap-and-cook/CameraCapture";
import IngredientList from "../../components/snap-and-cook/IngredientList";
import { Dialog, Transition } from "@headlessui/react";
import useAddCart from "@/hooks/cart/useAddCart";

type Ingredient = { name: string; quantity: number };
type Product = { id: number; name: string; prix: number; imageSrc: string; slug: string };

export default function SnapAndCook() {
  const [dish, setDish] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [productId: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useAddCart(); 

  const handleImageCaptured = async (imageData: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/snap-and-cook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      const result = await response.json();
      if (response.ok) {
        setDish(result.dish);
        setIngredients(result.ingredients);
        fetchMatchingProducts(result.ingredients);
      } else {
        console.error("Erreur lors de l'analyse de l'image:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchingProducts = async (ingredients: Ingredient[]) => {
    try {
      const ingredientNames = ingredients.map((ing) => ing.name);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientNames }),
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Erreur lors de la récupération des produits :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };


  const handleBatchAddToCart = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart({ productId: product.id, quantity, price: product.prix });
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      
      if (updatedCart[productId] > 1) {
        updatedCart[productId] -= 1;
      } else {
        delete updatedCart[productId];
      }
      
      return updatedCart;
    });
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Snap & Cook</h1>
      
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-6">
        <CameraCapture onImageCaptured={handleImageCaptured} />
      </div>

      {loading ? (
        <p className="text-center text-blue-600 font-semibold">Analyse en cours...</p>
      ) : (
        <div className="mt-8 max-w-xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Plat détecté :</h2>
            <p className="text-lg text-gray-600 mt-2">{dish || "Aucun plat détecté"}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Ingrédients détectés :</h2>
            {ingredients.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {ingredients.map((ing, index) => (
                  <li key={index} className="flex justify-between items-center text-lg text-gray-600">
                    <span>{ing.name}</span>
                    <span className="font-medium text-gray-800">{ing.quantity}g</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun ingrédient détecté pour le moment.</p>
            )}
          </div>
          
          {products.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Voir les produits correspondants
            </button>
          )}
        </div>
      )}

      {/* Modal pour afficher les produits */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-800 mb-4">
                    Produits correspondants
                  </Dialog.Title>

                  <IngredientList
                    ingredients={ingredients}
                    products={products}
                    cart={cart}
                    addToCart={handleBatchAddToCart}
                    removeFromCart={handleRemoveFromCart}
                  />

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 w-full py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
