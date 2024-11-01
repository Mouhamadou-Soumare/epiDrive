'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "../../types";

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
        console.error('Erreur lors du chargement des utilisateurs :', error);
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
      <h2 className="text-xl font-bold text-gray-900">Liste des utilisateurs</h2>
      <div className="flex justify-between items-center mt-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="Rechercher une utilisateur"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-8 lg:grid-cols-2 sm:gap-x-6 xl:gap-x-8">
        {filteredUtilisateurs.map((utilisateur) => (
          <div key={utilisateur.id} className="flex flex-col items-center sm:items-start">
            <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col mt-4 ssm:mt-0 flex-1 text-sm w-full">
              <div className="font-bold text-gray-900 sm:flex sm:justify-between">
                <h5>{utilisateur.username}</h5>
              </div>
              <p className="text-gray-500 my-2">{utilisateur.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UtilisateurList;
