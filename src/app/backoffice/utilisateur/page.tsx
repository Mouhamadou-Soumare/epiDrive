'use client';

import { useState, useEffect } from "react";
import UserCard from "./components/UserCard";
import SearchInput from "../components/SearchInput";
import { User } from "../../types";

const UtilisateurList = () => {
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
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
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <SearchInput 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
            placeholder="Rechercher un utilisateur"
          />
        </div>
        </div>
      </div>
      {filteredUtilisateurs.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-y-8 lg:grid-cols-2 sm:gap-x-6 xl:gap-x-8">
          {filteredUtilisateurs.map((utilisateur) => (
            <UserCard key={utilisateur.id} utilisateur={utilisateur} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
};

export default UtilisateurList;
