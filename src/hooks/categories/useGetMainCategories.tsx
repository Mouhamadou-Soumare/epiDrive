import { useEffect, useState } from 'react';

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export const useGetMainCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); 
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          setError(data.error || 'Error fetching categories');
        }
      } catch (error) {
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
