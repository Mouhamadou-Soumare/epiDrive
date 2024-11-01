'use client';

import Link from "next/link";

import { useState, useEffect } from "react";

import { Categorie } from "../../types";

const CategoryList = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <h2 className="text-xl font-bold text-gray-900">Liste des catégories</h2>
      <div className="mt-4">
        <Link
          href="/backoffice/categorie/add"
          className="flex items-center justify-center rounded-md border border-transparent bg-green-100 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
        >
          Créer une catégorie
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="relative">
              <div className="relative h-72 w-full overflow-hidden rounded-lg">
                <img
                  alt={category.name}
                  src={'https://via.placeholder.com/300x300'} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="relative mt-4">
                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={`/backoffice/categorie/${category.slug}`}
                className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Voir la catégorie<span className="sr-only">, {category.name}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;