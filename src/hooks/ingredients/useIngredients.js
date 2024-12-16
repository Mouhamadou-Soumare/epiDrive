import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/ingredients';

// Hook pour récupérer tous les ingrédients
export function useGetIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch ingredients');
        setIngredients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading, error };
}

// Hook pour récupérer un ingrédient spécifique
export function useGetIngredient(id) {
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch ingredient');
        setIngredient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIngredient();
  }, [id]);

  return { ingredient, loading, error };
}

// Hook pour créer un ingrédient
export async function useAddIngredient(newIngredient) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newIngredient),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la création de l'ingrédient.");
  }

  return await response.json();
}

// Hook pour supprimer un ingrédient
export function useDeleteIngredient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteIngredient = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete ingredient');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteIngredient, loading, error };
}
