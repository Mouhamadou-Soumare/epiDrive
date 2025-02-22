"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CartContext } from "@/context/CartContext";

type CartSlideOverProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CartSlideOver({ open, setOpen }: CartSlideOverProps) {
  const cartContext = useContext(CartContext);
  if (!cartContext) return null; 

  const { cartItems, loading, updateQuantity, deleteProduct } = cartContext;
  const [localCart, setLocalCart] = useState(cartItems);
  const updateTimeout = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleDeleteProduct(productId);
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
  };

  const handleDeleteProduct = (productId: number) => {
    setLocalCart((prev) => prev.filter((item) => item.produit.id !== productId));

    deleteProduct(productId);
  };

  const subtotal = localCart.reduce((total, item) => total + item.prix * item.quantite, 0);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Panier</DialogTitle>
                    <button onClick={() => setOpen(false)} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    {loading ? (
                      <p>Chargement...</p>
                    ) : localCart.length === 0 ? (
                      <p>Votre panier est vide</p>
                    ) : (
                      <ul className="-my-6 divide-y divide-gray-200">
                        {localCart.map((item) => (
                          <li key={item.id} className="flex py-6 items-center">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.produit.image.path}
                                alt={`Image de ${item.produit.name}`}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.produit.name}</h3>
                                <p className="ml-4">{item.prix} €</p>
                              </div>

                              <div className="mt-2 flex items-center space-x-2">
                                <button
                                  className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite - 1)}
                                >
                                  -
                                </button>
                                <p className="text-sm text-gray-500">{item.quantite}</p>
                                <button
                                  className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                  onClick={() => handleUpdateQuantity(item.produit.id, item.quantite + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              className="ml-4 text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteProduct(item.produit.id)}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Sous-total</p>
                    <p>{subtotal.toFixed(2)} €</p>
                  </div>
                  
                  <button
                    onClick={() => { window.location.href = '/cart' }}
                    className="mt-6 flex w-full items-center justify-center rounded-md button-primary px-6 py-3 text-base font-medium text-white hover:bg-orange-700"
                  >
                    Passer à la caisse
                  </button>
                </div>

              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
