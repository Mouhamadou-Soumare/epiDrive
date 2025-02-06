"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Recette, Produit } from "types";
import { useGetRecette, useUpdateRecette } from "@/hooks/recettes/useRecettes";
import { useGetProduits } from "@/hooks/products/useProduits";
import FormInputField from "../../components/FormInputField";
import ProduitList from "../../components/ProduitList";
import Alert from "../../components/Alert";

export default function UpdateRecettePage() {
  const { slug } = useParams() as { slug: string | string[] };
  const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const recetteId = parseInt(recetteSlug, 10);
  const { recette, loading: recetteLoading, error: recetteError } = useGetRecette(
    isNaN(recetteId) ? null : recetteId
  );
    const { produits, loading: produitsLoading, error: produitsError } = useGetProduits();
  const { updateRecette, loading: updateLoading, error: updateError } = useUpdateRecette();

  const [localRecette, setLocalRecette] = useState<Recette | null>(recette);

  useEffect(() => {
    if (recette) {
      setLocalRecette(recette);
    }
  }, [recette]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (localRecette) {
      setLocalRecette({ ...localRecette, [name]: value });
    }
  };

  const handleAddProduit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const produitId = parseInt(e.target.value);
    const produit = produits?.find((p: Produit) => p.id === produitId);

    if (produit && localRecette && !localRecette.produits.some((p) => p.id === produitId)) {
      setLocalRecette({ ...localRecette, produits: [...localRecette.produits, produit] });
    }

    e.target.value = ""; // Reset selection
  };

  const handleRemoveProduit = (produitId: number) => {
    if (localRecette) {
      setLocalRecette({ ...localRecette, produits: localRecette.produits.filter((p) => p.id !== produitId) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localRecette) {
      updateRecette(localRecette.id, localRecette);
      if (!updateError) window.location.href = "/backoffice/recette/"+recetteSlug;
    }
  };

  if (recetteLoading || produitsLoading || updateLoading) return <div>Chargement...</div>;
  if (recetteError) return <div>Erreur lors du chargement de la recette</div>;
  if (produitsError) return <div>Erreur lors du chargement des produits</div>;
  if (!localRecette) return <div>Recette non trouvée</div>;

  return (
    <>
      {updateError && <Alert message="Une erreur est survenue lors de la mise à jour." type="error" />}
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Modifier la recette</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField
          id="title"
          name="title"
          value={localRecette.title}
          label="Titre"
          onChange={handleInputChange}
        />
        <FormInputField
          id="description"
          name="description"
          value={localRecette.description}
          label="Description"
          type="textarea"
          onChange={handleInputChange}
        />
        <FormInputField
          id="instructions"
          name="instructions"
          value={localRecette.instructions}
          label="Instructions"
          type="textarea"
          onChange={handleInputChange}
        />

        <div className="mb-5">
          <label htmlFor="produit" className="block mb-2 text-sm font-medium text-gray-900">
            Ingrédients
          </label>
          <select
            id="produit"
            name="produit"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleAddProduit}
          >
            <option value="">Ajouter un produit</option>
            {produits?.map((produit: Produit) => (
              <option key={produit.id} value={produit.id}>
                {produit.name}
              </option>
            ))}
          </select>
          <ProduitList produits={localRecette.produits} onRemoveProduit={handleRemoveProduit} />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Mettre à jour la recette
        </button>
      </form>
    </>
  );
}
