import { useState, useEffect } from 'react';

// Définition des types
interface Log {
  id: number;
  action: string;
  metadata?: Record<string, any>;
  fk_userId: number;
  createdAt: string;
}

interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/logs';

// Hook pour récupérer tous les logs
export function useGetLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data: Log[] = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch logs');
        setLogs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading, error };
}

// Hook pour récupérer un log spécifique
export function useGetLog(id: number | null) {
  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data: Log = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch log');
        setLog(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  return { log, loading, error };
}

// Hook pour créer un nouveau log
export function useAddLog() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addLog = async ({ action, metadata, fk_userId }: Omit<Log, 'id' | 'createdAt'>): Promise<Log> => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata, fk_userId }),
      });
      const data: Log = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to create log');
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addLog, loading, error };
}

// Hook pour supprimer un log
export function useDeleteLog() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteLog = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete log');
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLog, loading, error };
}
