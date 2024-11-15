'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Category = { 
  name: string; 
  slug: string; 
  imageSrc?: string;   
  imageAlt?: string; 
};

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          console.error('Error fetching categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  console.log(categories);

  if (loading) return <div>Chargement...</div>;
  if (!categories) return <div>Aucune catégorie trouvée</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Toutes les catégories</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  alt={category.imageAlt || `Image de la catégorie ${category.name}`}
                  src={category.imageSrc || 'https://via.placeholder.com/300'}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700 text-center">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
