import { useState, useEffect } from 'react';
import { Livraison } from 'types';


interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/livraisons';

// Hook pour récupérer toutes les livraisons
export function useGetLivraisons() {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data: Livraison[] = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch livraisons');
        setLivraisons(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivraisons();
  }, []);

  return { livraisons, loading, error };
}

// Hook pour récupérer une livraison spécifique
export function useGetLivraison(id: number | null) {
  const [livraison, setLivraison] = useState<Livraison | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLivraison = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data: Livraison = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch livraison');
        setLivraison(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivraison();
  }, [id]);

  return { livraison, loading, error };
}

// Hook pour supprimer une livraison
export function useDeleteLivraison() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteLivraison = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete livraison');
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLivraison, loading, error };
}
