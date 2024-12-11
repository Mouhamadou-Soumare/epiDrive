"use client";

import { useState, Fragment } from "react";
import CameraCapture from "@/components/snap-and-cook/CameraCapture";
import IngredientList from "@/components/snap-and-cook/IngredientList";
import { Dialog, Transition } from "@headlessui/react";

type Ingredient = { name: string; quantity: number };
type Product = { id: number; name: string; prix: number; imageSrc: string; slug: string };

export default function SnapAndCook() {
  const [dish, setDish] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [productId: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addToCart = (productId: number, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + quantity,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        updatedCart[productId] -= 1;
        if (updatedCart[productId] === 0) delete updatedCart[productId];
      }
      return updatedCart;
    });
  };

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Snap & Cook</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <CameraCapture onImageCaptured={handleImageCaptured} />
      </div>

      {loading ? (
        <p className="text-center text-indigo-600 font-medium mt-8">Analyse en cours...</p>
      ) : (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Plat détecté :</h2>
            <p className="text-lg text-gray-500 mt-2">{dish || "Aucun plat détecté"}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Ingrédients détectés :</h2>
            {ingredients.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {ingredients.map((ing, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-lg text-gray-600"
                  >
                    <span>{ing.name}</span>
                    <span className="font-medium text-gray-800">{ing.quantity}g</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Aucun ingrédient détecté pour le moment.</p>
            )}
          </div>

          {products.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 px-4 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
            >
              Voir les produits correspondants
            </button>
          )}
        </div>
      )}

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
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-800 mb-4"
                  >
                    Produits correspondants
                  </Dialog.Title>

                  <IngredientList
                    ingredients={ingredients}
                    products={products}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
