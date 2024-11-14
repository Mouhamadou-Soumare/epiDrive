'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

import SearchInput from "../components/SearchInput";
import { Recette } from "../../types";
import RecetteRow from "./components/RecetteRow";

const RecetteList = () => {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [filteredRecettes, setFilteredRecettes] = useState<Recette[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recettes");
        const data = await response.json();
        setRecettes(data);
        setFilteredRecettes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      }
    };

    fetchRecettes();
  }, []);

  useEffect(() => {
    const filtered = recettes.filter(recette =>
      recette.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecettes(filtered);
  }, [searchQuery, recettes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des recettes</h1>
          <p className="mt-2 text-sm text-gray-700">
            listing des recettes du commerce
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/backoffice/recette/add"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Créer une recette
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          placeholder="Rechercher un recette"
        />
      </div>

      {filteredRecettes.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Id</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredRecettes.map((recette) => (
                  <RecetteRow key={recette.id} recette={recette} />
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Aucune recette trouvée</div>
        )
      }
    </div>

  );
};

export default RecetteList;