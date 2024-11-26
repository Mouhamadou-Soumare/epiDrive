import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/products';

// Hook pour récupérer tous les produits
export function useGetProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
        setProduits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return { produits, loading, error };
}

// Hook pour récupérer un produit spécifique
export function useGetProduit(id) {
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch product');
        setProduit(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduit();
  }, [id]);

  return { produit, loading, error };
}

// Hook pour créer un produit
export function useAddProduit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduit = async ({ name, description, prix, categorieId, path }) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, prix, categorieId, path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create product');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addProduit, loading, error };
}

// Hook pour mettre à jour un produit
export function useUpdateProduit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduit = async (id, { name, description, prix, categorieId, path }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, prix, categorieId, path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update product');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduit, loading, error };
}

// Hook pour supprimer un produit
export function useDeleteProduit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProduit = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete product');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProduit, loading, error };
}
