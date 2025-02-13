import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = { 
  id: number; 
  name: string; 
  prix: number; 
  imageSrc: string; 
  imageAlt: string; 
  slug: string; 
  description: string;
};

type SubCategory = { 
  name: string; 
  slug: string; 
  imageSrc?: string; 
  imageAlt?: string; 
  subcategories?: SubCategory[]; 
  produits?: Product[];
};

export function useCategory() {
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
          console.error("Erreur lors de la récupération de la catégorie :", data.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  return { currentCategory, loading };
}
