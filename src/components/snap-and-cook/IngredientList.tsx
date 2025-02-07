"use client";

import { useState } from "react";

type Product = { id: number; name: string; prix: number };

interface IngredientListProps {
  products: Product[];
  cart: { [productId: number]: number };
  addToCart: (productId: number, quantity: number) => void; 
  removeFromCart: (productId: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setCart: (cart: { [productId: number]: number }) => void;
}

export default function IngredientList({ products, cart, addToCart, removeFromCart, setIsModalOpen, setCart }: IngredientListProps) {
  const [localCart, setLocalCart] = useState<{ [productId: number]: number }>(cart); 

  const handleQuantityChange = (productId: number, change: number) => {
    setLocalCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + change;
      return newQuantity >= 0 ? { ...prevCart, [productId]: newQuantity } : prevCart;
    });
  };

  /**
   * 🔹 Valide l'ajout des produits au panier.
   */
  const handleConfirmAddToCart = () => {
    Object.entries(localCart).forEach(([productId, quantity]) => {
      const product = products.find((p) => p.id === Number(productId));
      if (product && quantity > 0) {
        addToCart(product.id, quantity);
      }
    });

    alert("Panier mis à jour !");
  
    // Réinitialiser les quantités à 0 tout en conservant les produits
    const updatedCart = Object.keys(localCart).reduce((acc, productId) => {
      acc[Number(productId)] = 0;
      return acc;
    }, {} as { [productId: number]: number });

    setCart(updatedCart);

    // Fermer la modal
    setIsModalOpen(false);
  };
  

  return (
    <div className="space-y-4">
      <ul className="mt-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between border-b border-gray-200 py-4">
            <div>
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">{product.prix.toFixed(2)}€</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(product.id, -1)}
                className="px-3 py-1 bg-red-500 text-white rounded-md disabled:bg-gray-300"
                disabled={!localCart[product.id]}
              >
                -
              </button>
              <span className="font-semibold">{localCart[product.id] || 0}</span>
              <button
                onClick={() => handleQuantityChange(product.id, 1)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleConfirmAddToCart}
        className="w-full mt-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Valider
      </button>
    </div>
  );
}
