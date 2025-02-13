import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Order {
    id: number;
    status: string;
    createdAt: string;
    total: number;
    products: { id: number; name: string; quantity: number; price: number }[];
  }
  
export function useUserOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    async function fetchOrders() {
      try {
        if (!session?.user?.id) return;
        const res = await fetch(`/api/orders?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des commandes");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Impossible de charger les commandes.");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [session, status]);

  return { orders, loading, error };
}
