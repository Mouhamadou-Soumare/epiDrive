"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";
import { useGetProduit, useUpdateProduit } from "@/hooks/products/useProduits";
import { useGetCategories } from "@/hooks/categories/useCategories";
import Alert from "../../../components/Alert";
import { Categorie, Produit } from "types";
import SelectInput from "../../components/SelectInput";
import LoadingSpinner from "@/app/backoffice/components/LoadingSpinner";

export default function UpdateProductPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string | string[] };
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { produit, loading: productLoading, error: productError } = useGetProduit(productSlug);
  const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories();
  const { updateProduit, loading: updatingProduct, error: updateError } = useUpdateProduit();

  const [updatedProduit, setUpdatedProduit] = useState<Produit | null>(null);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const [newImage, setNewImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      }
  };
  
  useEffect(() => {
    if (produit) {
      console.log("Produit chargé", produit);
      setUpdatedProduit(produit);
    }
  }, [produit]);

  // Formattage des catégories avec useMemo pour éviter de recalculer à chaque rendu
  const categoryOptions = useMemo(() => 
    categories.map((cat: Categorie) => ({ value: cat.id, label: cat.name })),
  [categories]);

  // Gestion des changements des inputs avec useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setUpdatedProduit((prev) => {
      if (!prev) return null;
      let updatedValue: any = value;

      // Convertir prix et categorieId en nombre
      if (name === "prix") {
        updatedValue = parseFloat(value);
      } else if (name === "categorieId") {
        updatedValue = parseInt(value);
      }

      return { ...prev, [name]: updatedValue };
    });
  }, []);

  // Vérification des champs avant soumission
  const validateForm = () => {
    if (!updatedProduit) return "Le produit est introuvable.";
    if (updatedProduit.name.length < 3) return "Le nom doit contenir au moins 3 caractères.";
    if (updatedProduit.description.length < 10) return "La description doit contenir au moins 10 caractères.";
    if (updatedProduit.prix <= 0) return "Le prix doit être un nombre positif.";
    if (!updatedProduit.categorieId) return "Veuillez sélectionner une catégorie.";
    return null;
  };

  // Gestion de la soumission du formulaire avec chargement avant redirection
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);
    
    const errorMsg = validateForm();
    if (errorMsg) {
      setSubmitResult(errorMsg);
      return;
    }

    setLoadingState(true);
    const success = await updateProduit(productSlug, updatedProduit, newImage);
    
    if (success) {
      setSubmitResult("Le produit a été mis à jour avec succès !");
      setTimeout(() => {
        router.push(`/backoffice/product/${productSlug}`);
      }, 3000);
    } else {
      setSubmitResult("Une erreur est survenue lors de la mise à jour du produit.");
      setLoadingState(false);
    }
  }, [productSlug, updatedProduit, updateProduit, router]);

  if (productLoading || categoriesLoading || updatingProduct) {
    return (
      <LoadingSpinner/>
    );
  }

  if (!updatedProduit) {
    return <div className="text-center text-gray-500">❌ Produit non trouvé</div>;
  }

  return (
    <>
    {loadingState ? (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">🔄 Mise à joours du produit en cours...</p>
          </div>
      </div>
    ) : (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="mb-4">
        {submitResult && <Alert message={submitResult} type={submitResult.includes("succès") ? "success" : "error"} />}
        {updateError && <Alert message="Erreur lors de la mise à jour du produit." type="error" />}
        {productError && <Alert message="Erreur lors du chargement du produit." type="error" />}
        {categoriesError && <Alert message="Erreur lors du chargement des catégories." type="error" />}
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Modifier le produit</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Nom du produit"
          id="name"
          name="name"
          value={updatedProduit.name}
          onChange={handleInputChange}
          required
        />

        <TextareaInput
          label="Description"
          id="description"
          name="description"
          value={updatedProduit.description}
          onChange={handleInputChange}
          required
        />

        <TextInput
          label="Prix (€)"
          id="prix"
          name="prix"
          type="number"
          value={updatedProduit.prix}
          onChange={handleInputChange}
          min={0}
          max={1000}
          step={0.01}
          required
        />

        {updatedProduit.image && (
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
        )}

        <SelectInput
          label="Catégorie"
          id="categorieId"
          name="categorieId"
          value={updatedProduit.categorieId}
          options={categoryOptions}
          onChange={handleInputChange}
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loadingState}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300 transition duration-200"
          >
            Mettre à jour le produit
          </button>
        </div>
        </form>
      </div>)}
    </>
  );
}
