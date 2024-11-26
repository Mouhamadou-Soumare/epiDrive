import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/logs';

// Hook pour récupérer tous les logs
export function useGetLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch logs');
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading, error };
}

// Hook pour récupérer un log spécifique
export function useGetLog(id) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch log');
        setLog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLog();
  }, [id]);

  return { log, loading, error };
}

// Hook pour créer un nouveau log
export function useAddLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLog = async ({ action, metadata, fk_userId }) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata, fk_userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create log');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addLog, loading, error };
}

// Hook pour supprimer un log
export function useDeleteLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLog = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete log');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLog, loading, error };
}
