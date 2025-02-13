"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckIcon } from "@heroicons/react/20/solid";

import ProductImage from "../components/ProductImage";
import ProductActions from "../components/ProductActions";
import Alert from "../../components/Alert";

import { useGetProduit, useDeleteProduit } from "@/hooks/products/useProduits";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ProductDetails() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string | string[] };
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { produit, loading: productLoading, error: productError } = useGetProduit(productSlug);
  const { deleteProduit, loading: deletingProduct, error: deleteError } = useDeleteProduit();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  const handleDelete = useCallback(async () => {
    if (!produit) return;

    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    const success = await deleteProduit(produit.slug);

    if (success) {
      setDeleteSuccess(true);
      setTimeout(() => {
        router.push("/backoffice/product");
      }, 2000);
    } else {
      setIsDeleting(false);
    }
  }, [produit, deleteProduit, router]);

  if (productLoading || deletingProduct || isDeleting) {
    return (
       <LoadingSpinner/>
    );
  }

  if (deleteSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-700">Produit supprimé avec succès !</p>
        </div>
      </div>
    );
  }

  if (productError) {
    return <Alert message="Erreur lors de la récupération du produit." type="error" />;
  }

  if (!produit) {
    return <div className="text-center text-gray-500"> Produit non trouvé</div>;
  }

  return (
    <div className="bg-white">
      {deleteError && <Alert message="Erreur lors de la suppression du produit." type="error" />}

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{produit.name}</h1>

          <section aria-labelledby="information-heading" className="mt-4">
            <p className="text-lg text-gray-900 sm:text-xl">{produit.prix}€</p>
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
