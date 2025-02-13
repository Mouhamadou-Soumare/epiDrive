'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import SearchInput from "../components/SearchInput";
import { Recette } from "types";
import RecetteRow from "./components/RecetteRow";
import { useGetRecettes } from "@/hooks/recettes/useRecettes";
import LoaderComponent from "@/components/LoaderComponent";
import LoadingSpinner from "../components/LoadingSpinner";

const RecetteList = () => {
  const { recettes, loading, error } = useGetRecettes();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtrage optimisé avec useMemo
  const filteredRecettes = useMemo(() => {
    if (!recettes) return [];
    return recettes.filter((recette: Recette) =>
      recette.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recettes]);

  const totalPages = Math.ceil(filteredRecettes.length / itemsPerPage);

  // Pagination optimisée avec useMemo
  const paginatedRecettes = useMemo(() => {
    return filteredRecettes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, filteredRecettes]);

  // Optimisation de la gestion de la recherche avec useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-lg">
        ❌ Une erreur est survenue : {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des recettes</h1>
          <p className="mt-2 text-sm text-gray-700">Retrouvez toutes les recettes disponibles</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/backoffice/recette/add"
            className="block rounded-md button-secondary text-dark px-3 py-2 text-center text-sm font-semibold shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            Créer une recette
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange}
          placeholder="Rechercher une recette"
          aria_label="Rechercher une recette"
        />
      </div>

      {/* Liste des recettes */}
      {paginatedRecettes.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Id
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nom
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Info
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRecettes.map((recette) => (
                    <RecetteRow key={recette.id} recette={recette} />
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
        <div className="mt-8 text-center text-gray-500">
          ❌ Aucune recette trouvée
        </div>
      )}
    </div>
  );
};

export default RecetteList;
