'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

import RecetteCard from "./components/RecetteCard";
import SearchInput from "../components/SearchInput";
import { Recette } from "../../types";

const RecetteList = () => {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [filteredRecettes, setFilteredRecettes] = useState<Recette[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recettes");
        if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
        const data = await response.json();
        setRecettes(data);
        setFilteredRecettes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
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
      <h2 className="text-xl font-bold text-gray-900">Liste des recettes</h2>
      <div className="flex justify-between items-center mt-4 gap-4">
        <Link href={`/backoffice/recette/add`} className="w-44 flex items-center justify-center rounded-md border border-transparent bg-green-100 py-2 text-sm font-medium text-green-900 hover:bg-green-200">
          Créer une recette
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <SearchInput 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
            placeholder="Rechercher une recette"
          />
        </div>
      </div>
      {filteredRecettes.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-y-8 lg:grid-cols-2 sm:gap-x-6 xl:gap-x-8">
          {filteredRecettes.map((recette) => (
            <RecetteCard key={recette.id} recette={recette} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">Aucune recette trouvée.</p>
      )}
    </div>
  );
};

export default RecetteList;