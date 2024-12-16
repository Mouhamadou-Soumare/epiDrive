import { useEffect, useState } from 'react';
import { Categorie } from "../../../types";

export const useGetMainCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data: Categorie[] = await res.json(); // Utilisation de l'interface Categorie pour le typage

        if (res.ok) {
          // Filtrer uniquement les catégories principales (parentId === null)
          const mainCategories = data.filter((category) => category.parentId === null);
          setCategories(mainCategories);
        } else {
          setError('Erreur lors de la récupération des catégories');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
