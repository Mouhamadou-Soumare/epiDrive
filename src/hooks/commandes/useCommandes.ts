import { useState, useEffect } from "react";
import { Commande, CommandeStatus } from "types";

interface FetchError {
  error: string;
}

const API_BASE_URL = "/api/commande";

export function useGetCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = (await response.json()) as Commande[];
        if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to fetch commandes");
        setCommandes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  return { commandes, loading, error };
}

export function useGetCommande(slug: string) {
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Invalid Commande Slug");
      return;
    }

    const fetchCommande = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/commande/${slug}`);
        const data = (await response.json()) as Commande;
        if (!response.ok) throw new Error(data.error || "Failed to fetch commande");
        setCommande(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [slug]);

  return { commande, loading, error };
}


export function useAddCommande() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addCommande = async (newCommande: Omit<Commande, "id" | "createdAt">): Promise<Commande> => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommande),
      });
      const data = (await response.json()) as Commande;
      if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to add commande");
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCommande, loading, error };
}

export function useUpdateCommande() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateCommande = async (id: number, updatedCommande: Partial<Commande>): Promise<Commande> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCommande),
      });
      const data = (await response.json()) as Commande;
      if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to update commande");
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCommande, loading, error };
}

export function useDeleteCommande() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCommande = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { message: string };
      if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to delete commande");
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCommande, loading, error };
}
