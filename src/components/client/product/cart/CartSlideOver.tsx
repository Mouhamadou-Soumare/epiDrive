"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGetCart } from "@/hooks/cart/useGetCart";

type CartSlideOverProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CartSlideOver({ open, setOpen }: CartSlideOverProps) {
  const { cartItems, loading, refreshCart } = useGetCart();

  const subtotal = cartItems.reduce(
    (total: number, item) => total + item.prix * item.quantite,
    0
  );

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
                      <span className="sr-only">Fermer le panneau</span>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {loading ? (
                        <p>Chargement...</p>
                      ) : cartItems.length === 0 ? (
                        <p>Votre panier est vide</p>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex py-6">
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
                                <p className="mt-1 text-sm text-gray-500">Quantité: {item.quantite}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Sous-total</p>
                    <p>{subtotal.toFixed(2)} €</p>
                  </div>
                  <button className="mt-6 flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
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
