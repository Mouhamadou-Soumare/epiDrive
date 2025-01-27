import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour consommer des événements SSE
 * @param {string} url - URL de la source SSE
 * @returns {{ data: any[], loading: boolean, error: string | null }}
 */
export const useSSE = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du traitement des données SSE");
      }
    };

    eventSource.onerror = () => {
      setError("Erreur de connexion au serveur SSE");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, loading, error };
};
