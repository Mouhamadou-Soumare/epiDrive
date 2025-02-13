'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/client/product/productGrid';
import LoaderComponent from '@/components/LoaderComponent';

type Product = { 
  id: number; 
  name: string; 
  prix: number; 
  imageSrc: string; 
  imageAlt: string; 
  slug: string; 
  description: string 
};
type SubCategory = { 
  name: string; 
  slug: string; 
  imageSrc?: string; 
  imageAlt?: string; 
  subcategories?: SubCategory[]; 
  produits?: Product[] 
};

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string | string[] };
  const [currentCategory, setCurrentCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      const lastSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

      try {
        const res = await fetch(`/api/categories/${lastSlug}`);
        const data = await res.json();
        if (res.ok) {
          setCurrentCategory(data);
        } else {
          console.error('Error fetching category:', data.error);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  if (loading) return <LoaderComponent />;
  if (!currentCategory) return <div>Catégorie non trouvée</div>;
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h1>

        {/* Affichage des sous-catégories */}
        {currentCategory.subcategories && currentCategory.subcategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-8">
            {currentCategory.subcategories.map((subCategory) => (
              <Link key={subCategory.slug} href={`/category/${Array.isArray(slug) ? slug.join('/') : slug}/${subCategory.slug}`} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    alt={subCategory.imageAlt || `Image de la sous-catégorie ${subCategory.name}`}
                    src={subCategory.imageSrc || 'https://via.placeholder.com/300'}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{subCategory.name}</h3>
              </Link>
            ))}
          </div>
        ) : currentCategory.produits && currentCategory.produits.length > 0 ? (
          <ProductGrid products={currentCategory.produits} />
        ) : (
          <div>Aucun produit ou sous-catégorie trouvé</div>
        )}
      </div>
    </div>
  );
}
