import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/livraisons';

// Hook pour récupérer toutes les livraisons
export function useGetLivraisons() {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch livraisons');
        setLivraisons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivraisons();
  }, []);

  return { livraisons, loading, error };
}

// Hook pour récupérer une livraison spécifique
export function useGetLivraison(id) {
  const [livraison, setLivraison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivraison = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch livraison');
        setLivraison(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLivraison();
  }, [id]);

  return { livraison, loading, error };
}

// Hook pour supprimer une livraison
export function useDeleteLivraison() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLivraison = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete livraison');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLivraison, loading, error };
}
