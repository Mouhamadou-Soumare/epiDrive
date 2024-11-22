'use client';

import { useState, useEffect } from "react";
import CommandeRow from "./components/CommandeRow";
import { Commande } from "../../../../types";
import SearchInput from "../components/SearchInput";

const CommandeList = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/commande");
        const data = await response.json();
        setCommandes(data);
        setFilteredCommandes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    };

    fetchCommandes();
  }, []);

  useEffect(() => {
    const filtered = commandes.filter(commande =>
      commande.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommandes(filtered);
  }, [searchQuery, commandes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des commandes</h1>
          <p className="mt-2 text-sm text-gray-700">
            listing des commandes du commerce
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          placeholder="Rechercher une commande"
        />
      </div>

      {filteredCommandes.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Id</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredCommandes.map((commande) => (
                  <CommandeRow key={commande.id} commande={commande} />
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        ) : (
          <div className="mt-8">Aucune commande trouvée</div>
        )
      }
    </div>
  );
};

export default CommandeList;
