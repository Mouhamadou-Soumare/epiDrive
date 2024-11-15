"use client";

import { useState } from "react";

type Ingredient = { name: string; quantity: number };
type Product = { id: number; name: string; prix: number; imageSrc: string; slug: string };

interface IngredientListProps {
  ingredients: Ingredient[];
  products: Product[];
  cart: { [productId: number]: number };
  addToCart: (productId: number, quantity: number) => void; // Accept quantity for batch add
  removeFromCart: (productId: number) => void;
}

export default function IngredientList({ ingredients, products, cart, addToCart, removeFromCart }: IngredientListProps) {
  const [localCart, setLocalCart] = useState<{ [productId: number]: number }>(cart); // Local state for quantities

  const handleQuantityChange = (productId: number, change: number) => {
    setLocalCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + change;
      return newQuantity >= 0 ? { ...prevCart, [productId]: newQuantity } : prevCart;
    });
  };

  const handleConfirmAddToCart = () => {
    Object.entries(localCart).forEach(([productId, quantity]) => {
      if (quantity > 0) addToCart(Number(productId), quantity);
    });
    alert("Produits ajoutés au panier !");
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
