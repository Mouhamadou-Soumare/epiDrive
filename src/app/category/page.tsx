"use client";

import Link from "next/link";
import LoaderComponent from "@/components/LoaderComponent";
import { useGetCategories } from "@/hooks/categories/useCategories";

export default function AllCategoriesPage() {
  const { categories, loading, error } = useGetCategories();

  if (loading) return <LoaderComponent />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!categories || categories.length === 0)
    return <div>Aucune catégorie trouvée</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Toutes les catégories
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  alt={
                    category.name || `Image de la catégorie ${category.name}`
                  }
                  src={category.imageSrc || "https://via.placeholder.com/300"}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700 text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
