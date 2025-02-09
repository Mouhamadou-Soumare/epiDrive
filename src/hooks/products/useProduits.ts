import { useState, useEffect } from 'react';
import { Produit } from 'types';

interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/products';

// Hook pour récupérer tous les produits
export function useGetProduits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = (await response.json()) as Produit[];
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch products');
        setProduits(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return { produits, loading, error };
}

// Hook pour récupérer un produit spécifique
export function useGetProduit(id: string | null) {
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json(); // ✅ On ne fait pas `.map()`, car on attend UN SEUL produit

        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch product');

        // ✅ Assurer que `data` est bien un objet et non un tableau
        const produitFormate: Produit = {
          id: data.id,
          name: data.name,
          slug: data.slug || "", 
          prix: data.prix || 0,
          description: data.description || "",
          categorieId: data.categorie.id ?? null, 
          image: data.image || null,
        };

        setProduit(produitFormate); // ✅ Maintenant, `setProduit` reçoit bien un seul produit
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  return { produit, loading, error };
}

// Hook pour créer un produit
export function useAddProduit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addProduit = async (newProduct: Omit<Produit, 'id'>, path?: string): Promise<Produit> => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, path }),
      });
      const data: Produit = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to create product');
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addProduit, loading, error };
}

// Hook pour mettre à jour un produit
export function useUpdateProduit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduit = async (slug: string, product: Partial<Produit>, path?: string): Promise<Produit> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, path }),
      });
      const data: Produit = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to update product');
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduit, loading, error };
}

// Hook pour supprimer un produit
export function useDeleteProduit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduit = async (id: string): Promise<string> => {
    try {
      console.log('id', id);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete product');
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProduit, loading, error };
}
