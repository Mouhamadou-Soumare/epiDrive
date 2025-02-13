"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CameraCapture from "../../components/snap-and-cook/CameraCapture";
import IngredientList from "../../components/snap-and-cook/IngredientList";
import { useSnapAndCook } from "@/hooks/snapAndCook/useSnapAndCook";

export default function SnapAndCook() {
  const {
    dish,
    ingredients,
    products,
    cart,
    setCart,
    loadingImage,
    error,
    isModalOpen,
    handleImageCaptured,
    handleBatchAddToCart,
    handleRemoveFromCart,
    handleCloseModal,
    setIsModalOpen,
  } = useSnapAndCook();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Snap & Cook</h1>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-6">
        <CameraCapture onImageCaptured={handleImageCaptured} />
      </div>

      {loadingImage ? (
        <p className="text-center text-blue-600 font-semibold">Analyse en cours...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : (
        <div className="mt-8 max-w-xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Plat détecté :</h2>
            <p className="text-lg text-gray-600 mt-2">{dish?.title || "Aucun plat détecté"}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Ingrédients détectés :</h2>
            {ingredients.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {ingredients.map((ing) => (
                  <li key={ing.id} className="flex justify-between items-center text-lg text-gray-600">
                    <span>{ing.name}</span>
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-800 mb-4">
                  Produits correspondants
                </Dialog.Title>

                <IngredientList
                  products={products}
                  cart={cart}
                  setCart={setCart} 
                  addToCart={handleBatchAddToCart}
                  removeFromCart={handleRemoveFromCart}
                  setIsModalOpen={setIsModalOpen}
                />

                <button
                  onClick={handleCloseModal}
                  className="mt-6 w-full py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
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
}
