"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { CheckIcon } from "@heroicons/react/20/solid";

import ProductImage from "../components/ProductImage";
import ProductActions from "../components/ProductActions";
import Alert from "../../components/Alert";

import { useGetProduit, useDeleteProduit } from "@/hooks/products/useProduits";
import { Produit } from "types";

export default function ProductDetails() {
  const { slug } = useParams() as { slug: string | string[] };
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { produit, loading: productLoading, error: productError } = useGetProduit(
    productSlug
  ) as { produit: Produit | null, loading: boolean, error: any };
    const { deleteProduit, loading: deletingProduct, error: deleteError } = useDeleteProduit();

  const handleDelete = useCallback(async () => {
    if (!produit) return;

    const success = await deleteProduit(produit.slug);
    if (success) {
      window.location.assign("/backoffice/product");
    }
  }, [produit, deleteProduit]);

  if (productLoading || deletingProduct) {
    return <div className="lg:pl-72">Chargement...</div>;
  }

  if (productError) {
    return <Alert message="Erreur lors de la récupération du produit." type="error" />;
  }

  if (!produit) {
    return <div className="lg:pl-72">Produit non trouvé</div>;
  }

  return (
    <div className="bg-white">
      {deleteError && <Alert message="Erreur lors de la suppression du produit." type="error" />}

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{produit.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">{produit.prix}€</p>
            </div>
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{produit.description}</p>
            </div>
            <div className="mt-6 flex items-center">
              <CheckIcon aria-hidden="true" className="h-5 w-5 text-green-500" />
              <p className="ml-2 text-sm text-gray-500">En stock et prêt à être expédié</p>
            </div>
          </section>
        </div>

        {/* Produit image */}
        <ProductImage image={produit.image ?? null} altText={produit.name} />

        {/* Product actions */}
        <ProductActions productSlug={produit.slug} onDelete={handleDelete} />
      </div>
    </div>
  );
}
