import { useState, useEffect } from 'react';
import { Categorie } from 'types';

interface UseProductCategoryProps {
  categorieId: number | null;
}

export function useProductCategory({ categorieId }: UseProductCategoryProps) {
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategorie = async () => {
      if (!categorieId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/categories/${categorieId}`);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la catégorie');
        }
        const data = await response.json();
        setCategorie(data);
      } catch (err) {
        setError('Erreur lors du chargement de la catégorie');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorie();
  }, [categorieId]);

  return { categorie, error, loading };
}
