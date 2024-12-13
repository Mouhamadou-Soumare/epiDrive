"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";
import Alert from "../../components/Alert";
import { useGetIngredient, useDeleteIngredient } from "@/hooks/ingredients/useIngredients";
import { useAddProduit } from "@/hooks/products/useProduits";
import { useGetCategories } from "@/hooks/categories/useCategories";
import { Categorie, Ingredient } from "types";

export default function AddProductFromIngredientPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const ingredientSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const { ingredient, loading: ingredientLoading, error: ingredientError } = useGetIngredient(ingredientSlug) as { ingredient: Ingredient | null, loading: any, error: any };
  const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories() as { categories: Categorie[], loading: any, error: any };
  const { addProduit, loading: addingProduit, error: addError } = useAddProduit();
  const { deleteIngredient, loading: deletingIngredient, error: deleteError } = useDeleteIngredient();

  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [updatedIngredient, setUpdatedIngredient] = useState<Ingredient | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (ingredient) {
      setUpdatedIngredient(ingredient);
      const matchingCategory = categories.find(cat => cat.name === ingredient.categorie);
      setSelectedCategoryId(matchingCategory ? matchingCategory.id : null);
    }
  }, [ingredient, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (updatedIngredient) {
      setUpdatedIngredient(prev => ({
        ...prev!,
        [name]: name === "prix" ? parseFloat(value) : value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updatedIngredient || !selectedCategoryId) {
      setSubmitResult("error");
      return;
    }

    const newProduct = {
      name: updatedIngredient.name,
      description: updatedIngredient.description,
      prix: updatedIngredient.prix,
      categorieId: selectedCategoryId,
    };

    const success = await addProduit(newProduct, "");
    setSubmitResult(success ? "success" : "error");
    if (success) {
      await deleteIngredient(updatedIngredient.id);
      window.location.href = "/backoffice/product/"+newProduct.name.toLowerCase().replace(/ /g, '-');
    }
  };

  if (ingredientLoading || categoriesLoading || addingProduit || deletingIngredient) {
    return <div className="lg:pl-72">Chargement...</div>;
  }

  if (!updatedIngredient) {
    return <div className="lg:pl-72">Ingrédient non trouvé</div>;
  }

  return (
    <>
      {submitResult === "success" && (
        <Alert message="Le produit a été ajouté avec succès." type="success" />
      )}
      {submitResult === "error" && (
        <Alert message="Une erreur est survenue lors de l'ajout du produit." type="error" />
      )}
      {ingredientError && (
        <Alert message="Erreur lors de la récupération de l'ingrédient." type="error" />
      )}
      {categoriesError && (
        <Alert message="Erreur lors de la récupération des catégories." type="error" />
      )}
      {deleteError && (
        <Alert message="Erreur lors de la suppression de l'ingrédient." type="error" />
      )}
      {addError && (
        <Alert message="Erreur lors de l'ajout du produit." type="error" />
      )}
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
        Ajouter un produit à partir de l'ingrédient
      </h1>
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
          <label htmlFor="categorieId" className="block mb-2 text-sm font-medium text-gray-900">
            Catégorie
          </label>
          <select
            id="categorieId"
            name="categorieId"
            value={selectedCategoryId || ""}
            onChange={handleCategoryChange}
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
          {addingProduit ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </>
  );
}
