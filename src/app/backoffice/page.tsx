'use client';

import Link from 'next/link';
import { useGetUsers } from '@/hooks/users/useUsers';
import { useGetCommandes } from '@/hooks/commandes/useCommandes';
import { useGetProduits } from '@/hooks/products/useProduits';

/**
 * Page principale du backoffice.
 * Fournit des liens vers les différentes sections du backoffice.
 */
export default function Backoffice() {
  const { users, loading: loadingUsers, error: errorUsers } = useGetUsers();
  const { commandes, loading: loadingCommandes, error: errorCommandes } = useGetCommandes();
  const { produits, loading: loadingProducts, error: errorProducts } = useGetProduits();

  if (loadingUsers || loadingCommandes || loadingProducts) {
    return <div>Chargement...</div>;
  }

  if (errorUsers || errorCommandes || errorProducts) {
    return (
      <div className="text-red-500">
        Une erreur est survenue lors du chargement des données.
      </div>
    );
  }

  return (
    <div>
      <main className="py-10">
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {users && (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/utilisateur"} className="truncate text-sm font-medium text-gray-500">
                Total d'utilisateurs
              </Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {users.length}
              </dd>
            </div>
          )}
          {commandes && (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/commande"} className="truncate text-sm font-medium text-gray-500">
                Total des commandes
              </Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {commandes.length}
              </dd>
            </div>
          )}
          {produits && (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/product"} className="truncate text-sm font-medium text-gray-500">
                Total des produits
              </Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {produits.length}
              </dd>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
