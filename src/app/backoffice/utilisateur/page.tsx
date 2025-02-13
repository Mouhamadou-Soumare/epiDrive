'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import SearchInput from "../components/SearchInput";
import UtilisateurRow from "./components/UtilisateurRow";
import { useGetUsers } from "@/hooks/users/useUsers";
import LoadingSpinner from "../components/LoadingSpinner";
import { User, Role } from "types"; 

const UtilisateurList = () => {
  const { users, loading, error } = useGetUsers();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtrage optimisé avec useMemo (évite recalculs inutiles)
  const filteredUtilisateurs = useMemo(() => {
    return users.filter((user: User) => {
      return (
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedRole === "" || user.role === selectedRole)
      );
    });
  }, [searchQuery, selectedRole, users]);

  const totalPages = Math.ceil(filteredUtilisateurs.length / itemsPerPage);
  const paginatedUtilisateurs = useMemo(() => {
    return filteredUtilisateurs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, filteredUtilisateurs]);

  // Utilisation de useCallback pour éviter la recréation de la fonction
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-medium">❌ Erreur : {error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des utilisateurs</h1>
          <p className="mt-2 text-sm text-gray-700">Listing des utilisateurs du commerce</p>
        </div>
      </div>

      {/* Barre de recherche et Filtre */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un utilisateur"
          aria_label="Rechercher un utilisateur"
        />

        {/* Dropdown Filtre Rôle */}
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Filtrer par rôle"
        >
          <option value="">Tous les rôles</option>
          <option value={Role.USER}>Utilisateur</option>
          <option value={Role.ADMIN}>Administrateur</option>
          <option value={Role.MAGASINIER}>Magasinier</option>
        </select>
      </div>

      {/* Table des utilisateurs */}
      {paginatedUtilisateurs.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Id</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rôle</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUtilisateurs.map((utilisateur) => (
                    <UtilisateurRow key={utilisateur.id} utilisateur={utilisateur} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">Aucun utilisateur trouvé</div>
      )}
    </div>
  );
};

export default UtilisateurList;
