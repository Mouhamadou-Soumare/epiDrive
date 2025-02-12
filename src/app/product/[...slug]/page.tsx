"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";
import { useCart } from "@/context/CartContext"; 
import LoaderComponent from "@/components/LoaderComponent";

type Product = {
  id: number;
  name: string;
  prix: number;
  description: string;
  image: { path: string };
};

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
        const res = await fetch(`/api/products/${productSlug}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération du produit");

        const data = await res.json();
        setProduct(data);
        console.log("✅ Produit récupéré:", data);
      } catch (error) {
        console.error("❌ Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product.id, quantity, product.prix);

    // ✅ Affichage du message de confirmation
    setConfirmationMessage(`Le produit "${product.name}" a été ajouté au panier (${quantity}x).`);

    // ✅ Disparition du message après 3 secondes
    setTimeout(() => setConfirmationMessage(null), 3000);
  };

  if (loading) {
    return (
      <LoaderComponent/>
    );
  }

  if (!product) {
    return <div className="text-center text-lg font-semibold text-red-500">❌ Produit non trouvé</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          
          {/* ✅ Détails du produit */}
          <div className="lg:max-w-lg lg:self-end">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <section className="mt-4">
              <p className="text-lg text-gray-900 sm:text-xl">{product.prix}€</p>
              <p className="mt-4 text-base text-gray-500">{product.description}</p>

              <div className="mt-6 flex items-center">
                <CheckIcon aria-hidden="true" className="h-5 w-5 text-green-500" />
                <p className="ml-2 text-sm text-gray-500">En stock et prêt à être expédié</p>
              </div>
            </section>
          </div>

          {/* ✅ Image du produit */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg h-96">
              <img src={product.image.path} alt={product.name} className="h-full w-full object-cover object-center" />
            </div>
          </div>

          {/* ✅ Formulaire d'ajout au panier */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <div className="mt-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantité
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
                >
                  Ajouter au panier
                </button>
              </div>

              {confirmationMessage && (
                <div className="mt-4 p-4 text-green-800 bg-green-200 border border-green-500 rounded-lg text-center">
                  {confirmationMessage}
                </div>
              )}

              <div className="mt-6 text-center">
                <a href="#" className="inline-flex items-center text-base font-medium text-gray-500 hover:text-gray-700">
                  <ShieldCheckIcon aria-hidden="true" className="mr-2 h-6 w-6" />
                  Garantie à vie
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
