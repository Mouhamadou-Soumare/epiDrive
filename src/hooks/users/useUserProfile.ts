import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Fonction utilitaire pour formater la date en "dd/MM/yyyy"
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function useUserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  // Redirection si utilisateur non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // Initialisation de la date
  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  // Récupération des statistiques utilisateur
  useEffect(() => {
    async function fetchStats() {
      try {
        if (!session?.user?.id) return;
        const res = await fetch(`/api/stats?userId=${session.user.id}`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [session]);

  return { session, status, stats, loading, currentDate };
}
