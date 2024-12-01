"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";
import SelectInput from "../../components/SelectInput";
import { useGetProduit, useUpdateProduit } from "@/hooks/products/useProduits";
import { useGetCategories } from "@/hooks/categories/useCategories";
import Alert from "../../../components/Alert";
import { Categorie, Produit } from "types";

export default function UpdateProductPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { produit, loading: productLoading, error: productError } = useGetProduit(productSlug) as { produit: Produit | null, loading: any, error: any };
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
          return { ...prev, categorie: selectedCategory || null };
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
    <>
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

      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Mettre à jour le produit</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <TextInput
          label="Nom"
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
          label="Prix"
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
          <TextInput
            label="Image Path"
            id="imagePath"
            name="imagePath"
            value={updatedProduit.image.path}
            onChange={handleInputChange}
          />
        )}
        <div className="mb-5">
          <label htmlFor="categorieId" className="block mb-2 text-sm font-medium text-gray-900">Catégorie</label>
          <select
            id="categorieId"
            name="categorieId"
            value={updatedProduit.categorie?.id || ""}
            onChange={handleInputChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat: Categorie) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {updatingProduct ? "Mise à jour en cours..." : "Mettre à jour le produit"}
        </button>
      </form>
    </>
  );
}
