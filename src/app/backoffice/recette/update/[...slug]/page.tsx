"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Recette, Produit } from "types";
import { useGetRecette, useUpdateRecette } from "@/hooks/recettes/useRecettes";
import { useGetProduits } from "@/hooks/products/useProduits";
import FormInputField from "../../components/FormInputField";
import ProduitList from "../../components/ProduitList";
import Alert from "../../components/Alert";

export default function UpdateRecettePage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string | string[] };
  const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const recetteId = parseInt(recetteSlug, 10);

  const { recette, loading: recetteLoading, error: recetteError } = useGetRecette(isNaN(recetteId) ? null : recetteId);
  const { produits, loading: produitsLoading, error: produitsError } = useGetProduits();
  const { updateRecette, loading: updateLoading, error: updateError } = useUpdateRecette();

  const [localRecette, setLocalRecette] = useState<Recette | null>(recette);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newImage, setNewImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setNewImage(e.target.files[0]);
      }
  };

  useEffect(() => {
    if (recette) setLocalRecette(recette);
  }, [recette]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (localRecette) {
      setLocalRecette((prev) => prev ? { ...prev, [name]: value } : prev);
    }
  }, [localRecette]);

  const handleAddProduit = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const produitId = parseInt(e.target.value);
    const produit = produits?.find((p: Produit) => p.id === produitId);
    
    if (produit && localRecette && !localRecette.produits.some((p) => p.id === produitId)) {
      setLocalRecette((prev) => prev ? { ...prev, produits: [...prev.produits, produit] } : prev);
    }
    
    e.target.value = "";
  }, [localRecette, produits]);

  const handleRemoveProduit = useCallback((produitId: number) => {
    setLocalRecette((prev) => prev ? { ...prev, produits: prev.produits.filter((p) => p.id !== produitId) } : prev);
  }, []);

  const validateForm = () => {
    if (!localRecette?.title.trim()) return "Le titre est requis.";
    if (!localRecette?.description.trim()) return "La description est requise.";
    if (!localRecette?.instructions.trim()) return "Les instructions sont requises.";
    if (localRecette.produits.length === 0) return "Veuillez ajouter au moins un produit.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    await updateRecette(localRecette!.id, localRecette!, newImage);
    setSubmitSuccess(true);
    setTimeout(() => router.push(`/backoffice/recette/${recetteSlug}`), 2000);
  };

  if (recetteLoading || produitsLoading || updateLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Chargement...</p>
      </div>
    );
  }

  if (recetteError || produitsError) return <Alert message="Erreur lors du chargement des données." type="error" />;
  if (!localRecette) return <Alert message="Recette non trouvée." type="error" />;

  return (
    <>
      {submitSuccess && <Alert message="Recette mise à jour avec succès !" type="success" />}
      {updateError && <Alert message="Erreur lors de la mise à jour." type="error" />}
      {validationError && <Alert message={validationError} type="error" />}
      
      <h1 className="text-3xl font-extrabold text-gray-900">Modifier la recette</h1>
      
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField id="title" name="title" value={localRecette.title} label="Titre" onChange={handleInputChange} />
        <FormInputField id="description" name="description" value={localRecette.description} label="Description" type="textarea" onChange={handleInputChange} />
        <FormInputField id="instructions" name="instructions" value={localRecette.instructions} label="Instructions" type="textarea" onChange={handleInputChange} />

        <div className="mb-5">
            <label htmlFor="productImage" className="block mb-2 text-sm font-medium text-gray-900">Chemin de l'image</label>
            <input
            type="file"
            id="productImage"
            name="productImage"
            accept="image/*"
            
            className="mt-1 block w-full text-sm text-gray-500 border-gray-300 rounded-md"
            onChange={handleImageChange}
            />
        </div>

        <div className="mb-5">
          <label htmlFor="produit" className="block mb-2 text-sm font-medium text-gray-900">Ingrédients</label>
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
          className="w-full sm:w-auto px-5 py-2.5 text-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm focus:ring-4 focus:outline-none focus:ring-blue-300"
          disabled={updateLoading}
        >
          {updateLoading ? "Mise à jour en cours..." : "Mettre à jour la recette"}
        </button>
      </form>
    </>
  );
}
