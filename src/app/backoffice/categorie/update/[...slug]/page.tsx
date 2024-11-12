'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Categorie } from "../../../../types";
import FormInputField from "../../components/FormInputField";
import Alert from "../../components/Alert";

export default function UpdateCategoryPage() {
  const { slug } = useParams(); 
  const [category, setCategory] = useState<Categorie | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitResult, setSubmitResult] = useState<string>('');

  useEffect(() => {    
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();
        if (res.ok) setCategory(data);
        else console.error('Erreur lors de la récupération de la catégorie:', data.error);
      } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
      } finally {
        setLoading(false);
      }
    }
    
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }

    fetchCategory();
    fetchCategories();
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      try {
        const res = await fetch(`/api/categories/${category.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
        if (res.ok) setSubmitResult('200');
        else setSubmitResult('error');
      } catch (error) {
        setSubmitResult('error');
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
      }
    }
  };

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!category) return <div className="lg:pl-72">Catégorie non trouvée</div>;

  return (
    <>
      {submitResult && <Alert message="Category updated successfully" type="success" />}
      <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Update Category</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField id="name" name="name" value={category.name} label="Name" onChange={handleInputChange} />
        <FormInputField id="description" name="description" value={category.description} label="Description" type="textarea" onChange={handleInputChange} />
        <FormInputField id="imageId" name="imageId" value={category.imageId} label="Image ID" type="number" onChange={handleInputChange} />

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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update Category</button>
      </form>
    </>
  );
}
