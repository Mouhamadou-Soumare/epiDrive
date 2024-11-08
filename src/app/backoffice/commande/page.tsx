'use client';

import { useState, useEffect } from "react";
import CommandeRow from "./components/CommandeRow";
import { Commande } from "../../types";

const CommandeList = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/commande");
        const data = await response.json();
        setCommandes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <h2 className="text-xl font-bold text-gray-900">Liste des commandes</h2>
      
      <table className="mt-4 w-full text-gray-500 sm:mt-6">
        <thead className="text-left text-sm text-gray-500">
          <tr>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">Id</th>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">Prix</th>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">Statut</th>
            <th scope="col" className="py-3 font-bold">Info</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
          {commandes.map((commande) => (
            <CommandeRow key={commande.id} commande={commande} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeList;
