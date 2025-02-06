import { useEffect, useState } from "react";

interface CommandHistoryItem {
  date: string;
  count: number;
}

interface FetchResponse {
  success: boolean;
  data: { date: string; count: string }[];
  error?: string;
}

export const useCommandHistory = (groupBy: "day" | "week" | "month" = "day") => {
  const [data, setData] = useState<CommandHistoryItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommandHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/backoffice/home/commandhistory?groupBy=${groupBy}`);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const result = (await response.json()) as FetchResponse;

        if (result.success) {
          const parsedData: CommandHistoryItem[] = result.data.map((item) => ({
            ...item,
            count: parseInt(item.count, 10), // Convertit `count` en nombre
          }));
          setData(parsedData);
        } else {
          throw new Error(result.error || "Erreur inconnue");
        }
      } catch (err) {
        setError((err as Error).message || "Erreur de récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandHistory();
  }, [groupBy]);

  return { data, loading, error };
};
