import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = '/api/recettes';

export function useGetRecettes() {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch recettes');
        setRecettes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecettes();
  }, []);

  return { recettes, loading, error };
}

export function useGetRecette(id) {
  const [recette, setRecette] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecette = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch recette');
        setRecette(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecette();
  }, [id]);

  return { recette, loading, error };
}

export function useAddRecette() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRecette = async (newRecette) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecette),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add recette');
      return data; // Return the created recette
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRecette, loading, error };
}

export function useUpdateRecette() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRecette = async (id, updatedRecette) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecette),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update recette');
      return data; // Return the updated recette
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRecette, loading, error };
}

export function useDeleteRecette() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRecette = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete recette');
      return data.message; // Return success message
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecette, loading, error };
}
