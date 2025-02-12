import { useState, useEffect, useCallback } from 'react';
import { Recette } from 'types';


interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/recettes';

// Hook pour récupérer toutes les recettes
export function useGetRecettes() {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data: Recette[] = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch recettes');
        setRecettes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecettes();
  }, []);

  return { recettes, loading, error };
}

// Hook pour récupérer une recette spécifique
export function useGetRecette(id: number | null) {
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecette = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data: Recette = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch recette');
        setRecette(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecette();
  }, [id]);

  return { recette, loading, error };
}

// Hook pour ajouter une recette
export function useAddRecette() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addRecette = async (newRecette: Omit<Recette, "id">, newImage?: File): Promise<Recette> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", newRecette.title);
      formData.append("description", newRecette.description);
      formData.append("instructions", newRecette.instructions);
      formData.append("userId", newRecette.user.id.toString());

      if (newRecette.produits) {
        formData.append("produits", JSON.stringify(newRecette.produits.map(p => p.id)));
      }

      if (newRecette.ingredients) {
        formData.append("ingredients", JSON.stringify(newRecette.ingredients.map(i => i.id)));
      }

      if (newImage) {
        formData.append("newImage", newImage);
      }

      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        body: formData, // Pas de `Content-Type`
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la création de la recette");
      }

      return await response.json();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRecette, loading, error };
}

// Hook pour mettre à jour une recette
export function useUpdateRecette() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateRecette = async (id: number, updatedRecette: Partial<Recette>, newImage?: File): Promise<Recette> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", updatedRecette.title || "");
      formData.append("description", updatedRecette.description || "");
      formData.append("instructions", updatedRecette.instructions || "");
      formData.append("userId", updatedRecette.user.id.toString() || "");

      if (updatedRecette.produits) {
        formData.append("produits", JSON.stringify(updatedRecette.produits.map(p => p.id)));
      }

      if (newImage) {
        formData.append("newImage", newImage);
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        body: formData, // Pas de `Content-Type`
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la mise à jour de la recette");
      }

      return await response.json();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRecette, loading, error };
}

// Hook pour supprimer une recette
export function useDeleteRecette() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRecette = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete recette');
      return data.message; // Retourne le message de succès
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecette, loading, error };
}
