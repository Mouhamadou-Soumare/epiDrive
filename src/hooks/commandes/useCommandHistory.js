import { useEffect, useState } from "react";

export const useCommandHistory = (groupBy = "day") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/backoffice/home/commandhistory?groupBy=${groupBy}`);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          const parsedData = result.data.map((item) => ({
            ...item,
            count: parseInt(item.count, 10), // Convertit `count` en nombre
          }));
          setData(parsedData);
        } else {
          throw new Error(result.error || "Erreur inconnue");
        }
      } catch (err) {
        setError(err.message || "Erreur de récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandHistory();
  }, [groupBy]);

  return { data, loading, error };
};
