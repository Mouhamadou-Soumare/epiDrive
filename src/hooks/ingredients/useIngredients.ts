import { useState, useEffect } from 'react';
import { Ingredient } from "types"; 


interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/ingredients';

// Hook pour récupérer tous les ingrédients
export function useGetIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data: Ingredient[] = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch ingredients');
        setIngredients(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading, error };
}

// Hook pour récupérer un ingrédient spécifique
export function useGetIngredient(id: number | null) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchIngredient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data: Ingredient = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch ingredient');
        setIngredient(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id]);

  return { ingredient, loading, error };
}

// Hook pour créer un ingrédient
export async function useAddIngredient(newIngredient: Omit<Ingredient, 'id'>): Promise<Ingredient> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIngredient),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error((error as FetchError).message || "Erreur lors de la création de l'ingrédient.");
  }

  return await response.json();
}

// Hook pour supprimer un ingrédient
export function useDeleteIngredient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteIngredient = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete ingredient');
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteIngredient, loading, error };
}
