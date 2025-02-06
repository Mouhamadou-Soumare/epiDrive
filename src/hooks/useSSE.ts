import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour consommer des événements SSE
 * @param url - URL de la source SSE
 * @returns { data: T[], loading: boolean, error: string | null }
 */
export const useSSE = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const parsedData: T[] = JSON.parse(event.data);
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
