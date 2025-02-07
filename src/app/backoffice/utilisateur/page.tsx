'use client';

import { useState, useEffect } from "react";
import SearchInput from "../components/SearchInput";
import UtilisateurRow from "./components/UtilisateurRow";
import { useGetUsers } from "@/hooks/users/useUsers";
import { User } from "types";

const UtilisateurList = () => {
  const { users, loading, error } = useGetUsers();
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUtilisateurs(users);
    }
  }, [users]);

  useEffect(() => {
    const filtered = users.filter((user: User) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUtilisateurs(filtered);
  }, [searchQuery, users]);

  const totalPages = Math.ceil(filteredUtilisateurs.length / itemsPerPage);
  const paginatedUtilisateurs = filteredUtilisateurs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des utilisateurs</h1>
          <p className="mt-2 text-sm text-gray-700">Listing des utilisateurs du commerce</p>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un utilisateur"
        />
      </div>

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
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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
