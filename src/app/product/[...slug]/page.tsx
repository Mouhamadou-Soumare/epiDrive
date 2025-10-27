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
                src={typeof product.image === "string" ? product.image : (product.image as any)?.path}
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
                  {/* Ergonomic qty selector: decrement button, numeric input, increment button */}
                  <div className="mt-1 flex items-center gap-2 w-40">
                    <button
                      type="button"
                      aria-label="Réduire la quantité"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-lg hover:bg-gray-50"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>

                    <input
                      id="quantity"
                      name="quantity"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (Number.isNaN(val)) return setQuantity(1);
                        // clamp between 1 and stock
                        setQuantity(Math.max(1, Math.min(product.stock, val)));
                      }}
                      onBlur={(e) => {
                        // ensure non-empty and valid on blur
                        const val = parseInt(e.target.value, 10);
                        if (Number.isNaN(val) || val < 1) setQuantity(1);
                        else if (val > product.stock) setQuantity(product.stock);
                      }}
                      className="block text-center w-full flex-1 rounded-md border border-gray-300 px-2 py-2 focus:outline-none"
                    />

                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-lg hover:bg-gray-50"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Stock disponible : {product.stock}</p>
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
                  className={`flex w-full items-center justify-center rounded-md px-8 py-3 text-white text-black focus:ring-2 focus:ring-orange-500 
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
