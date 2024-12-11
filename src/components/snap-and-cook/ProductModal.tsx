import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Ingredient, Product, Cart } from '@/types/types';
import IngredientList from './IngredientList';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  products: Product[];
  cart: Cart;
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  ingredients,
  products,
  cart,
  addToCart,
  removeFromCart,
}: ProductModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800 mb-4">
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
                  onClick={onClose}
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
  );
}