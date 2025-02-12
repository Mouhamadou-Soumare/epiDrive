"use client";

import { useState } from 'react';
import Alert from '../../components/Alert';
import FormInputField from '../components/FormInputField';
import { Categorie } from "../../../../../types";
import { useGetCategories, useAddCategory } from "@/hooks/categories/useCategories";

export default function AddCategoryPage() {
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { addCategory, loading: addingCategory, error: addError } = useAddCategory();
  const [newImage, setNewImage] = useState<File | null>(null);

  const [category, setCategory] = useState<Categorie>({
    id: 0,
    name: '',
    slug: '',
    description: '',
    imageId: 0,
    parentId: undefined,
    subcategories: []
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: name === "imageId" || name === "parentId" ? parseInt(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name || !category.description || !newImage) {
      setSubmitResult('400'); // Message d'erreur si des champs requis sont vides
      return;
    }

    // Appel au hook personnalisé `addCategory`
    const success = await addCategory(category, newImage);
    if (success) {
      setSubmitResult('201');
      setTimeout(() => {
        const slug = category.name.toLowerCase().replace(/ /g, '-');
        window.location.assign(`/backoffice/categorie/${slug}`);
      }, 2000);
    } else {
      setSubmitResult('500');
    }
  };

  if (loadingCategories) return <div>Chargement des catégories...</div>;

  return (
    <>
      {submitResult === '201' && <Alert message="Category added successfully" type="success" />}
      {submitResult === '500' && <Alert message="Error during adding category" type="error" />}
      {submitResult === '400' && <Alert message="Please fill in all required fields" type="warning" />}
      {addError && <Alert message="Failed to add category" type="error" />}
      {errorCategories && <Alert message="Failed to load categories" type="error" />}
      
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Add Category</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField
          id="name"
          name="name"
          value={category.name}
          label="Name"
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
          type="image"
          id="imagePath"
          name="imagePath"
          value=""
          label="Chemin de l'image"
          onChange={handleImageChange}
        />

        <div className="mb-5">
          <label htmlFor="parentId" className="block mb-2 text-sm font-medium text-gray-900">Parent Category</label>
          <select
            id="parentId"
            name="parentId"
            value={category.parentId || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleInputChange}
          >
            <option value="">Select a parent category</option>
            {categories.map((cat: Categorie) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={addingCategory}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {addingCategory ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </>
  );
}
