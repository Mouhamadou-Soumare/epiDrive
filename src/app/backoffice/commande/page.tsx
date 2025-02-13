"use client";

import { useState, useMemo, useCallback } from "react";
import { useGetCommandes } from "@/hooks/commandes/useCommandes";
import CommandeRow from "./components/CommandeRow";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { Commande, CommandeStatus } from "types";

const CommandeList = () => {
  const { commandes, loading, error } = useGetCommandes();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Filtre statut
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtrage des commandes
  const filteredCommandes = useMemo(() => {
    return commandes.filter((commande: Commande) => {
      const matchSearch = commande.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus =
        selectedStatus === "" || commande.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [commandes, searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredCommandes.length / itemsPerPage);

  // Pagination des commandes
  const paginatedCommandes = useMemo(() => {
    return filteredCommandes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredCommandes, currentPage]);

  // Gestion des événements
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  if (error)
    return (
      <div className="text-red-500 text-center py-6">Erreur : {error}</div>
    );

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold text-gray-900">
            Liste des commandes
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Listing des commandes du commerce
          </p>
        </div>
      </div>

      {/* Barre de recherche et Filtre */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher une commande"
          aria_label="Rechercher une commande"
        />

        {/* Filtre Statut */}
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value={CommandeStatus.EN_ATTENTE}>En attente</option>
          <option value={CommandeStatus.EN_PREPARATION}>En préparation</option>
          <option value={CommandeStatus.EXPEDIEE}>Expédiée</option>
          <option value={CommandeStatus.LIVREE}>Livrée</option>
          <option value={CommandeStatus.ANNULEE}>Annulée</option>
        </select>
      </div>

      {paginatedCommandes.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 text-left text-sm font-semibold text-gray-900">
                      Id
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCommandes.map((commande: Commande) => (
                    <CommandeRow key={commande.id} commande={commande} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-gray-700 text-center">
          Aucune commande trouvée
        </div>
      )}
    </div>
  );
};

export default CommandeList;
