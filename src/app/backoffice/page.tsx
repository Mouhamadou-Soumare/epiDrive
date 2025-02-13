'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useGetUsers } from '@/hooks/users/useUsers';
import { useGetCommandes } from '@/hooks/commandes/useCommandes';
import { useGetProduits } from '@/hooks/products/useProduits';
import CommandHistoryChart from '@/components/backoffice/CommandHistoryChart';
import StatCard from './components/StatCard';

export default function Backoffice() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirection si l'utilisateur n'est pas connecté ou n'est pas admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Récupération des données
  const { users, loading: loadingUsers, error: errorUsers } = useGetUsers();
  const { commandes, loading: loadingCommandes, error: errorCommandes } = useGetCommandes();
  const { produits, loading: loadingProducts, error: errorProducts } = useGetProduits();

  // Chargement en cours
  if (loadingUsers || loadingCommandes || loadingProducts) {
    return <div className="text-center py-10 text-lg font-medium">Chargement...</div>;
  }

  // Gestion des erreurs
  if (errorUsers || errorCommandes || errorProducts) {
    return (
      <div className="text-red-500 text-center py-10">
        <p>Une erreur est survenue lors du chargement des données.</p>
        <p>{errorUsers || errorCommandes || errorProducts}</p>
      </div>
    );
  }

  return (
    <div>
      <main className="py-10">
        {/* Cartes des statistiques */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Total d'utilisateurs" value={users?.length || 0} link="/backoffice/utilisateur" />
          <StatCard title="Total des commandes" value={commandes?.length || 0} link="/backoffice/commande" />
          <StatCard title="Total des produits" value={produits?.length || 0} link="/backoffice/product" />
        </div>

        {/* Graphique des commandes */}
        <div className="mt-10 bg-white rounded-lg px-4 py-5 shadow sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Historique des commandes en temps réel
          </h2>
          <div className="mt-6">
            <CommandHistoryChart />
          </div>
        </div>
      </main>
    </div>
  );
}
