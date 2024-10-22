'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SubCategory = { name: string; slug: string };

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<SubCategory[] | null>(null);
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

  if (loading) return <div>Chargement...</div>;
  if (!categories) return <div>Aucune catégorie trouvée</div>;

  return (
    <div>
      <h1>Toutes les catégories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
