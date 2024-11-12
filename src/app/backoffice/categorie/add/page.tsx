"use client";

import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import FormInputField from '../components/FormInputField';
import { Categorie } from "../../../types";

export default function AddCategoryPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [category, setCategory] = useState<Categorie>({
    id: 0,
    name: '',
    slug: '',
    description: '',
    imageId: 0,
    parentId: undefined,
    subcategories: []
  });
  const [submitResult, setSubmitResult] = useState<string>('');

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.name || !category.description || !category.imageId) {
      setSubmitResult('400');
      return;
    }
    try {
      const res = await fetch(`/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult('201');
        setTimeout(() => {
          const slug = category.name.toLowerCase().replace(/ /g, '-');
          window.location.assign(`/backoffice/categorie/${slug}`);
        }, 2000);
      } else {
        setSubmitResult(res.status.toString());
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setSubmitResult('500');
    }
  };

  return (
    <>
      {submitResult === '201' && <Alert message="Category added successfully" type="success" />}
      {submitResult === '500' && <Alert message="Error during adding category" type="error" />}
      {submitResult === '400' && <Alert message="Please fill in all required fields" type="warning" />}
      <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Add Category</h1>
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
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add Category</button>
      </form>
    </>
  );
};
