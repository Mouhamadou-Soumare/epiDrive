"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";
import { useGetIngredient } from "@/hooks/ingredients/useIngredients";
import { useAddProduit } from "@/hooks/products/useProduits";
import { useGetCategories } from "@/hooks/categories/useCategories";
import Alert from "../../../components/Alert";
import { Categorie, Ingredient } from "types";
import LoadingSpinner from "@/app/backoffice/components/LoadingSpinner";

export default function AddProductFromIngredientPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const ingredientSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const ingredientId = parseInt(ingredientSlug, 10);
  const { ingredient, loading: ingredientLoading, error: ingredientError } = useGetIngredient(
    isNaN(ingredientId) ? null : ingredientId
  ) as { ingredient: Ingredient | null, loading: any, error: any };

  const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories() as { categories: Categorie[], loading: any, error: any };
  const { addProduit, loading: addingProduit, error: addError } = useAddProduit();

  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const [updatedIngredient, setUpdatedIngredient] = useState<Ingredient | null>(null);
  const [category, setCategory] = useState<Categorie | null>(null);

  useEffect(() => {
    if (ingredient) {
      setUpdatedIngredient(ingredient);
    }
    if (ingredientError) {
      console.error("Erreur lors de la récupération du ingredient :", ingredientError);
    }
    if (categoriesError) {
      console.error("Erreur lors de la récupération des catégories :", categoriesError);
    }
  }, [ingredient, ingredientError, categoriesError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (updatedIngredient) {
      let updatedValue: any = value;

      // Gestion des types spécifiques
      if (name === "prix") {
        updatedValue = parseFloat(value);
      } else if (["categorieId"].includes(name)) {
        updatedValue = parseInt(value);
      }

      // Mettre à jour l'état
      setUpdatedIngredient((prev: any) => {
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
    if (updatedIngredient) {
      const newProduct = {
        name: updatedIngredient.name,
        description: updatedIngredient.description,
        prix: updatedIngredient.prix,
        categorieId: category ? category.id : 0,
        slug: updatedIngredient.name.toLowerCase().replace(/ /g, '-'), // Génération automatique du slug
      };

      const success = await addProduit(newProduct, "");
      setSubmitResult(success ? "success" : "error");
    }
  };

  if (ingredientLoading || categoriesLoading || addingProduit) {
    return <LoadingSpinner/> ;
  }

  if (!updatedIngredient) {
    return <div className="lg:pl-72">Ingredient non trouvé</div>;
  }

  return (
    <>
      {submitResult === "success" && (
        <Alert message="Le ingredient a été mis à jour avec succès." type="success" />
      )}
      {addError && (
        <Alert message="Une erreur s'est ingrediente lors de l'ajout de l'ingredient." type="error" />
      )}
      {ingredientError && (
        <Alert message="Erreur lors de la récupération du ingredient." type="error" />
      )}
      {categoriesError && (
        <Alert message="Erreur lors de la récupération des catégories." type="error" />
      )}

      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Mettre à jour le ingredient</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <TextInput
          label="Nom"
          id="name"
          name="name"
          value={updatedIngredient.name}
          onChange={handleInputChange}
          required
        />
        <TextareaInput
          label="Description"
          id="description"
          name="description"
          value={updatedIngredient.description}
          onChange={handleInputChange}
          required
        />
        <TextInput
          label="Prix"
          id="prix"
          name="prix"
          type="number"
          value={updatedIngredient.prix}
          onChange={handleInputChange}
          min={0}
          max={1000}
          step={0.01}
          required
        />
        <div className="mb-5">
          <label htmlFor="categorieId" className="block mb-2 text-sm font-medium text-gray-900">Catégorie</label>
          <select
            id="categorieId"
            name="categorieId"
            value={""}
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
          {addingProduit ? "Ajout d'un produit..." : "Ajouter un produit"}
        </button>
      </form>
    </>
  );
}
