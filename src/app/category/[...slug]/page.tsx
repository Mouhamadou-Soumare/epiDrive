'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/client/product/ProductGrid';

type Product = { id: number; name: string; price: number; imageSrc: string; imageAlt: string, slug : string, description : string };
type SubCategory = { name: string; slug: string; children?: SubCategory[]; produits?: Product[]   };

export default function CategoryPage() {
  const { slug } = useParams();
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

  if (loading) return <div>Chargement...</div>;
  if (!currentCategory) return <div>Catégorie non trouvée</div>;

  return (
    <div>
      <h1>{currentCategory.name}</h1>

      {currentCategory.children && currentCategory.children.length > 0 ? (
        <ul>
          {currentCategory.children.map((subCategory) => (
            <li key={subCategory.slug}>
              <Link href={`/category/${Array.isArray(slug) ? slug.join('/') : slug}/${subCategory.slug}`}>
                {subCategory.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : currentCategory.produits && currentCategory.produits.length > 0 ? (
          <ProductGrid products={currentCategory.produits} />
      ) : (
        <div>Aucun produit ou sous-catégorie trouvé</div>
      )}
    </div>
  );
}
