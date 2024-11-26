import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/paniers';

// Hook pour récupérer tous les paniers
export function useGetPaniers() {
  const [paniers, setPaniers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaniers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch paniers');
        setPaniers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaniers();
  }, []);

  return { paniers, loading, error };
}

// Hook pour récupérer un panier spécifique
export function useGetPanier(id) {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch panier');
        setPanier(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPanier();
  }, [id]);

  return { panier, loading, error };
}

// Hook pour créer un nouveau panier
export function useAddPanier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPanier = async ({ userId, sessionId, produits }) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId, produits }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create panier');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addPanier, loading, error };
}

// Hook pour mettre à jour un panier
export function useUpdatePanier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePanier = async (id, { produits }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produits }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update panier');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePanier, loading, error };
}

// Hook pour supprimer un panier
export function useDeletePanier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePanier = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete panier');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePanier, loading, error };
}
