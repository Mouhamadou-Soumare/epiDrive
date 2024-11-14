'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

import SearchInput from "../components/SearchInput";
import { User } from "../../types";
import UtilisateurRow from "./components/UtilisateurRow";

const UtilisateurList = () => {
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
        setUtilisateurs(data);
        setFilteredUtilisateurs(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      }
    };

    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    const filtered = utilisateurs.filter(utilisateur =>
      utilisateur.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUtilisateurs(filtered);
  }, [searchQuery, utilisateurs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des utilisateurs</h1>
          <p className="mt-2 text-sm text-gray-700">
            listing des utilisateurs du commerce
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          placeholder="Rechercher un utilisateur"
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Id</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prenom</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {filteredUtilisateurs.map((utilisateur) => (
                <UtilisateurRow key={utilisateur.id} utilisateur={utilisateur} />
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
};

export default UtilisateurList;