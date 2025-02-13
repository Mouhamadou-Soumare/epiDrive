"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useProductDetail } from "@/hooks/products/useProductDetails";
import { useAddToCart } from "@/hooks/cart/useAddToCartProductPage";
import LoaderComponent from "@/components/LoaderComponent";

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const { product, loading, error } = useProductDetail(slug);
  const { handleAddToCart, confirmationMessage } = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) return <LoaderComponent />;
  if (error || !product)
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        {" "}
        Produit non trouvé
      </div>
    );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Détails du produit */}
          <div className="lg:max-w-lg lg:self-end">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <section className="mt-4">
              <p className="text-lg text-gray-900 sm:text-xl">
                {product.prix}€
              </p>
              <p className="mt-4 text-base text-gray-500">
                {product.description}
              </p>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-green-500"
                />
                <p className="ml-2 text-sm text-gray-500">
                  {product.stock > 0
                    ? "En stock et prêt à être expédié"
                    : "Rupture de stock"}
                </p>
              </div>
            </section>
          </div>

          {/* Image du produit */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg h-96">
              <img
                src={product.image.path}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Formulaire d'achat */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddToCart(
                  product.id,
                  quantity,
                  product.prix,
                  product.name
                );
              }}
            >
              {/* Sélection de la quantité si en stock */}
              {product.stock > 0 ? (
                <div className="mt-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantité
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {Array.from({ length: product.stock }, (_, i) => i + 1).map(
                      (qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ) : (
                <div className="text-red-500 text-lg font-semibold">
                  {" "}
                  Ce produit est en rupture de stock
                </div>
              )}

              <div className="mt-10">
                <button
                  type="submit"
                  className={`flex w-full items-center justify-center rounded-md px-8 py-3 text-white text-black focus:ring-2 focus:ring-indigo-500 
      ${
        product.stock > 0
          ? "button-primary hover:bg-orange-500"
          : "bg-gray-300 cursor-not-allowed opacity-50"
      }`}
                  disabled={product.stock <= 0}
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Message de confirmation */}
              {confirmationMessage && (
                <div className="mt-4 p-4 text-green-800 bg-green-200 border border-green-500 rounded-lg text-center">
                  {confirmationMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
