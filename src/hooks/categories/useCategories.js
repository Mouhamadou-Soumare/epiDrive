import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/categorie';

// Hook pour récupérer toutes les catégories
export function useGetCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch categories');
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Hook pour récupérer une catégorie spécifique
export function useGetCategory(slug) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${slug}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch category');
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategory();
  }, [slug]);

  return { category, loading, error };
}

// Hook pour ajouter une catégorie
export function useAddCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCategory = async (newCategory) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add category');
      return data; // Retourne la nouvelle catégorie
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCategory, loading, error };
}

// Hook pour mettre à jour une catégorie
export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (slug, updatedCategory) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update category');
      return data; // Retourne la catégorie mise à jour
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
}

// Hook pour supprimer une catégorie
export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCategory = async (slug) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete category');
      return data.message; // Retourne le message de succès
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading, error };
}
