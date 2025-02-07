"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";
import { useGetProduit, useUpdateProduit } from "@/hooks/products/useProduits";
import { useGetCategories } from "@/hooks/categories/useCategories";
import Alert from "../../../components/Alert";
import { Categorie, Produit } from "types";

export default function UpdateProductPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { produit, loading: productLoading, error: productError } = useGetProduit(
    productSlug
  ) as { produit: Produit | null, loading: any, error: any };
    const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories() as { categories: Categorie[], loading: any, error: any };
  const { updateProduit, loading: updatingProduct, error: updateError } = useUpdateProduit();

  const [updatedProduit, setUpdatedProduit] = useState<Produit | null>(null);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    if (produit) {
      setUpdatedProduit(produit);
    }
    if (productError) {
      console.error("Erreur lors de la récupération du produit :", productError);
    }
    if (categoriesError) {
      console.error("Erreur lors de la récupération des catégories :", categoriesError);
    }
  }, [produit, productError, categoriesError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (updatedProduit) {
      let updatedValue: any = value;

      // Gestion des types spécifiques
      if (name === "prix") {
        updatedValue = parseFloat(value);
      } else if (["categorieId"].includes(name)) {
        updatedValue = parseInt(value);
      }

      // Mettre à jour l'état
      setUpdatedProduit((prev: any) => {
        if (!prev) return null;

        // Gestion spécifique pour categorieId
        if (name === "categorieId") {
          const selectedCategory = categories.find((cat) => cat.id === updatedValue);
          return { ...prev, 
            categorie: selectedCategory || null, 
            categorieId: updatedValue 
          };
        }

        if (name === "imagePath") {
          return { ...prev, image: { ...prev.image, path: updatedValue } };
        }

        return { ...prev, [name]: updatedValue };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedProduit) {
      const success = await updateProduit(productSlug, updatedProduit, updatedProduit.image?.path || "");
      setSubmitResult(success ? "success" : "error");
    }
  };

  if (productLoading || categoriesLoading || updatingProduct) {
    return <div className="lg:pl-72">Chargement...</div>;
  }

  if (!updatedProduit) {
    return <div className="lg:pl-72">Produit non trouvé</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Alertes */}
      <div className="mb-4">
        {submitResult === "success" && (
          <Alert message="Le produit a été mis à jour avec succès." type="success" />
        )}
        {updateError && (
          <Alert message="Une erreur s'est produite lors de la mise à jour du produit." type="error" />
        )}
        {productError && (
          <Alert message="Erreur lors de la récupération du produit." type="error" />
        )}
        {categoriesError && (
          <Alert message="Erreur lors de la récupération des catégories." type="error" />
        )}
      </div>

      {/* Titre */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Modifier le produit</h1>

      {/* Formulaire */}
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

        {/* Affichage du chemin de l'image si disponible */}
        {updatedProduit.image && (
          <TextInput
            label="Chemin de l'image"
            id="imagePath"
            name="imagePath"
            value={updatedProduit.image.path}
            onChange={handleInputChange}
          />
        )}

        {/* Sélecteur de catégorie */}
        <div>
          <label htmlFor="categorieId" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="categorieId"
            name="categorieId"
            value={updatedProduit.categorieId}
            onChange={handleInputChange}
            required
            className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-200"
          >
            {updatingProduct ? "Mise à jour en cours..." : "Mettre à jour le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}
