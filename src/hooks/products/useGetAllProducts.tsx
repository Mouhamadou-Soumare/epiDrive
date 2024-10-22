import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  description: string;
};

export const useGetAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          setError(data.error || 'Error fetching products');
        }
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
