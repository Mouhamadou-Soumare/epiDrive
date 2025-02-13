'use client';

import Link from 'next/link';
import { ProductGrid } from '@/components/client/product/productGrid';
import LoaderComponent from '@/components/LoaderComponent';
import { useCategory } from '@/hooks/categories/useCategory';

export default function CategoryPage() {
  const { currentCategory, loading } = useCategory();

  if (loading) return <LoaderComponent />;
  if (!currentCategory) return <div>Catégorie non trouvée</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 ml-8">{currentCategory.name}</h1>

      {currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentCategory.subcategories.map((sub) => (
              <Link key={sub.slug} href={`/category/${sub.slug}`}>
                <div className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-md">
                  {sub.imageSrc && (
                    <img
                      src={sub.imageSrc}
                      alt={sub.imageAlt || `Image de ${sub.name}`}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-600">
                      {sub.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {currentCategory.produits && currentCategory.produits.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 ml-12">Produits</h2>
          <ProductGrid products={currentCategory.produits} />
        </div>
      ) : (
        <p className="text-gray-500">Aucun produit disponible dans cette catégorie.</p>
      )}
    </div>
  );
}
