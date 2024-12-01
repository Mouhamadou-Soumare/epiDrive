import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/commande';

// Hook pour récupérer toutes les commandes
export function useGetCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch commandes');
        setCommandes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  return { commandes, loading, error };
}

// Hook pour récupérer une commande spécifique
export function useGetCommande(slug) {
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${slug}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch commande');
        setCommande(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCommande();
  }, [slug]);

  return { commande, loading, error };
}

// Hook pour ajouter une commande
export function useAddCommande() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCommande = async (newCommande) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommande),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add commande');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCommande, loading, error };
}

// Hook pour mettre à jour une commande
export function useUpdateCommande() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCommande = async (slug, updatedCommande) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCommande),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update commande');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCommande, loading, error };
}

// Hook pour supprimer une commande
export function useDeleteCommande() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCommande = async (slug) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete commande');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCommande, loading, error };
}
