"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageDisplay from "../components/ImageDisplay";
import ProduitCard from "../components/ProduitCard";
import IngredientCard from "../components/IngredientCard";
import Alert from "../components/Alert";
import { Produit, Recette, Ingredient } from "types";
import { useGetRecette, useDeleteRecette } from "@/hooks/recettes/useRecettes";

export default function RecetteDetails() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string | string[] };
  const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const recetteId = parseInt(recetteSlug, 10);
  const { recette, loading: recetteLoading, error: recetteError } = useGetRecette(
    isNaN(recetteId) ? null : recetteId
  );
  const { deleteRecette, loading: deleteRecetteLoading, error: deleteRecetteError } = useDeleteRecette();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!recette) return;

    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette recette ?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteRecette(recette.id);
      router.push("/backoffice/recette");
    } catch (err) {
      console.error("Erreur lors de la suppression de la recette:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [recette, deleteRecette, router]);

  if (recetteLoading || deleteRecetteLoading || isDeleting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Chargement...</p>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      </div>
    );
  }

  if (recetteError) {
    return <Alert message="Erreur lors de la récupération de la recette." type="error" />;
  }

  if (!recette) {
    return <div className="text-center text-gray-500">❌ Recette non trouvée</div>;
  }

  return (
    <div className="bg-white">
      {deleteRecetteError && <Alert message="Une erreur est survenue lors de la suppression." type="error" />}
      
      <div className="mx-auto max-w-2xl px-4 p-6 sm:p-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{recette.title}</h1>

          <section aria-labelledby="information-heading" className="mt-4">
            <p className="text-lg text-gray-900 sm:text-xl">{recette.description}</p>
            <h3 className="mt-4 text-lg font-bold text-gray-900">Instructions</h3>
            <p className="text-base text-gray-500">{recette.instructions}</p>

            <h3 className="mt-6 text-lg font-bold text-gray-900">Produits</h3>
            <ul role="list" className="divide-y divide-gray-200">
              {recette.produits.length > 0 ? (
                recette.produits.map((produit: Produit) => <ProduitCard key={produit.id} produit={produit} />)
              ) : (
                <p>Aucun produit associé</p>
              )}
            </ul>

            {recette.ingredients && recette.ingredients.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Ingrédients</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {recette.ingredients.map((ingredient: Ingredient) => (
                    <IngredientCard key={ingredient.id} ingredient={ingredient} />
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        {recette.image && <ImageDisplay src={recette.image} alt={recette.title} />}

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">Options de recette</h2>
            <div className="flex gap-4 flex-col">
              <Link
                href={`/backoffice/recette/update/${recette.id}`}
                className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
              >
                Modifier la recette
              </Link>
              <button
                onClick={handleDelete}
                className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-red-300 hover:bg-red-500 text-black focus:ring-2 focus:ring-indigo-500"
              >
                Supprimer la recette
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
