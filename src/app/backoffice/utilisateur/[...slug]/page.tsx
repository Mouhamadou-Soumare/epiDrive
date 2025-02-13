'use client';

import { useState, useMemo, useCallback } from "react";
import { UsersIcon } from '@heroicons/react/24/outline';
import CommandeCard from "../components/CommandeCard";
import { useGetUser } from "@/hooks/users/useUsers";
import { Commande, User } from "../../../../../types";
import { useParams } from 'next/navigation';
import LoadingSpinner from "@/components/LoadingSpinner";

const UserDetail = () => {
  const { slug } = useParams() as { slug: string | string[] };
  const userId = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const userIdNumber = useMemo(() => parseInt(userId, 10), [userId]);

  const { user, loading, error } = useGetUser(
    isNaN(userIdNumber) ? null : userIdNumber
  ) as { user: User | null, loading: boolean, error: any };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const commandes = user?.commandes ?? [];
  const totalPages = Math.ceil(commandes.length / itemsPerPage);

  // Optimisation de la pagination avec useMemo
  const paginatedCommandes = useMemo(() => {
    return commandes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [commandes, currentPage]);

  // Pagination optimisée avec useCallback
  const handlePrevPage = useCallback(() => setCurrentPage((prev) => Math.max(prev - 1, 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);

  if (loading) return <LoadingSpinner/>;
  if (error) return <div className="text-center text-red-500 font-medium">❌ Erreur : {error}</div>;
  if (!user) return <div className="text-center text-gray-500">❌ Utilisateur non trouvé</div>;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-3 shadow sm:px-6 sm:pt-5">
          <dt>
            <div className="absolute rounded-md button-primary text-dark p-3">
              <UsersIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{user.email}</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{user.username}</p>
          </dd>
        </div>
      </div>

      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-base font-semibold text-gray-900">Liste commandes de l'utilisateur</h1>

        {paginatedCommandes.length > 0 ? (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                    {paginatedCommandes.map((commande: Commande) => (
                      <CommandeCard key={commande.id} commande={commande} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 flex justify-center items-center space-x-4">
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Page précédente"
              >
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
              >
                Suivant
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-700">Cet utilisateur n'a pas encore passé de commande.</div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
