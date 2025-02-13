"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommandHistoryChart from "@/components/backoffice/CommandHistoryChart";
import StatCard from "@/app/backoffice/components/StatCard";

interface Stats {
  users: number;
  commandes: number;
  produits: number;
}

export default function Backoffice() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email) {
      router.push("/");
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const res = await fetch("/api/auth/check-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!res.ok) {
          router.push("/");
          return;
        }

        fetch("/api/backoffice/stats")
          .then((res) => res.json())
          .then((data) => {
            setStats(data);
            setLoading(false);
          })
          .catch(() => {
            setError("Impossible de récupérer les statistiques.");
            setLoading(false);
          });
      } catch {
        router.push("/");
      }
    };

    checkAdminStatus();
  }, [session, status, router]);

  if (loading) {
    return <div className="text-center py-10 text-lg font-medium">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        <p> Une erreur est survenue lors du chargement des données.</p>

      </div>
    );
  }

  return (
    <div>
      <main className="py-10">
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Total d'utilisateurs" value={stats?.users || 0} link="/backoffice/utilisateur" />
          <StatCard title="Total des commandes" value={stats?.commandes || 0} link="/backoffice/commande" />
          <StatCard title="Total des produits" value={stats?.produits || 0} link="/backoffice/product" />
        </div>

        <div className="mt-10 bg-white rounded-lg px-4 py-5 shadow sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Historique des commandes en temps réel</h2>
          <div className="mt-6">
            <CommandHistoryChart />
          </div>
        </div>
      </main>
    </div>
  );
}
