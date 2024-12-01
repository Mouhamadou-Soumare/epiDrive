'use client';

import { useState } from "react";
import { useGetCommandes } from "@/hooks/commandes/useCommandes";
import CommandeRow from "./components/CommandeRow";
import SearchInput from "../components/SearchInput";
import { Commande } from "types";

const CommandeList = () => {
  const { commandes, loading, error } = useGetCommandes();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCommandes = commandes.filter((commande: Commande) =>
    commande.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <div className="text-gray-700">Chargement des commandes...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des commandes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Listing des commandes du commerce
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
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Nom
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Prix
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCommandes.map((commande: Commande) => (
                    <CommandeRow key={commande.id} commande={commande} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-gray-700">Aucune commande trouvée</div>
      )}
    </div>
  );
};

export default CommandeList;
