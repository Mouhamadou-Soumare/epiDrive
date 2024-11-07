"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import Alert from "../components/Alert";
import DeleteButton from "../components/DeleteButton";
import { CheckIcon } from '@heroicons/react/20/solid';
import { Categorie } from "../../../types";

export default function CategoryDetails() {
  const { slug } = useParams(); 
  const [category, setCategory] = useState<Categorie | null>(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();
        if (res.ok) setCategory(data);
        else setError('Error fetching category');
      } catch (error) {
        setError('Error fetching category');
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [slug]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${category?.slug}`, { method: 'DELETE' });
      if (res.ok) window.location.assign('/backoffice/categorie');
      else setError('Error deleting category');
    } catch (error) {
      setError('Error deleting category');
    }
  };

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!category) return <div className="lg:pl-72">Catégorie non trouvée</div>;

  return (
    <div className="bg-white">
      {error && <Alert message={error} type="error" />}
      <div className="mx-auto p-4 sm:p-6 lg:p-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
        {/* Category details */}
        <div className="lg:max-w-lg lg:self-end">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{category.name}</h1>
          <section aria-labelledby="information-heading" className="mt-4">
            <div className="text-lg text-gray-900 sm:text-xl">{category.description}</div>
            <div className="mt-6 flex items-center">
              <CheckIcon aria-hidden="true" className="h-5 w-5 text-green-500" />
              <p className="ml-2 text-sm text-gray-500">Sous-catégories disponibles</p>
            </div>
          </section>
        </div>

        {/* Category image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center bg-dark-500">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96">
            <img src={`/api/images/${category.imageId}`} alt={category.name} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <div className="flex gap-4 flex-col">
              <Link href={`/backoffice/categorie/update/${category.slug}`} className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500">
                Modifier la catégorie
              </Link>
              <DeleteButton onDelete={handleDelete} label="Supprimer la catégorie" />
            </div>
          </section>
        </div>
      </div>
      {/* Subcategories */}
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sous-catégories</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {category.subcategories.length === 0 ? <p>Aucune sous-catégorie</p> : (
            category.subcategories.map((subcategory : Categorie) => (
              <Link key={subcategory.id} href={`/backoffice/categorie/${subcategory.slug}`} className="group block">
                {subcategory.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
