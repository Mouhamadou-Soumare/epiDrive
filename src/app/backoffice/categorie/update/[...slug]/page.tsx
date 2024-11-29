'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Categorie } from "../../../../../../types";
import FormInputField from "../../components/FormInputField";
import Alert from "../../components/Alert";
import { useGetCategory, useGetCategories, useUpdateCategory } from "@/hooks/categories/useCategories";

export default function UpdateCategoryPage() {
  const { slug } = useParams() as { slug: string };

  const { category, loading: categoryLoading, error: categoryError } = useGetCategory(slug) as { category: Categorie | null, loading: any, error: any };
  const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories()
  const { updateCategory, loading: updateLoading, error: updateError } = useUpdateCategory();

  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (category) {
      const updatedCategory = { ...category, [name]: name === "imageId" || name === "parentId" ? Number(value) : value };
      Object.assign(category, updatedCategory);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      const success = await updateCategory(slug, category);
      setSubmitResult(success ? 'success' : 'error');
    }
  };

  if (categoryLoading || categoriesLoading || updateLoading) return <div className="lg:pl-72">Chargement...</div>;
  if (categoryError || categoriesError) return <div className="lg:pl-72 text-red-500">Erreur lors du chargement des données.</div>;
  if (!category) return <div className="lg:pl-72">Catégorie non trouvée.</div>;

  return (
    <>
      {submitResult && (
        <Alert
          message={submitResult === 'success' ? 'Catégorie mise à jour avec succès.' : 'Une erreur est survenue.'}
          type={submitResult === 'success' ? 'success' : 'error'}
        />
      )}
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Modifier la catégorie</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField
          id="name"
          name="name"
          value={category.name}
          label="Nom"
          onChange={handleInputChange}
        />
        <FormInputField
          id="description"
          name="description"
          value={category.description}
          label="Description"
          type="textarea"
          onChange={handleInputChange}
        />
        <FormInputField
          id="imageId"
          name="imageId"
          value={category.imageId || ''}
          label="ID de l'image"
          type="number"
          onChange={handleInputChange}
        />

        <div className="mb-5">
          <label htmlFor="parentId" className="block mb-2 text-sm font-medium text-gray-900">
            Catégorie parente
          </label>
          <select
            id="parentId"
            name="parentId"
            value={category.parentId || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleInputChange}
          >
            <option value="">Sélectionner une catégorie parente</option>
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
          Mettre à jour la catégorie
        </button>
      </form>
    </>
  );
}
