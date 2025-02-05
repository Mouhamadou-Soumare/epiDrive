"use client";

import { useState, useEffect } from "react";

type Product = { id: number; name: string; prix: number };

interface IngredientListProps {
  products: Product[];
  cart: { [productId: number]: number };
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

export default function IngredientList({ products, cart, addToCart, removeFromCart }: IngredientListProps) {
  const [localCart, setLocalCart] = useState<{ [productId: number]: number }>({});

  /**
   * 🔹 Synchronise le panier local avec le panier global dès que `cart` change.
   */
  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  /**
   * 🔹 Met à jour la quantité d'un produit.
   */
  const handleQuantityChange = (productId: number, change: number) => {
    setLocalCart((prevCart) => {
      const newQuantity = (prevCart[productId] || 0) + change;

      if (newQuantity > 0) {
        addToCart(productId, change); // Ajoute au panier global
      } else {
        removeFromCart(productId); // Supprime du panier global
      }

      return newQuantity >= 0 ? { ...prevCart, [productId]: newQuantity } : prevCart;
    });
  };

  /**
   * 🔹 Valide l'ajout des produits au panier.
   */
  const handleConfirmAddToCart = () => {
    Object.entries(localCart).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        addToCart(Number(productId), quantity);
      }
    });
    //alert("Produits ajoutés au panier !");
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
