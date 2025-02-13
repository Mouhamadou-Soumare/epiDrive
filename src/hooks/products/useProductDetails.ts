import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  prix: number;
  description: string;
  image: string;
  stock: number;
};

export function useProductDetail(slug: string | string[]) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
        const res = await fetch(`/api/products/${productSlug}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération du produit");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Impossible de charger le produit.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
