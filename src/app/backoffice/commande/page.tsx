'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Commande, QuantiteCommande } from "../../types";

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

  function getPriceCommande(commande: Commande) {
    const quantites = commande.quantites as unknown as QuantiteCommande[];

    if (!quantites) {
      return 0;
    }
    var total = 0;

    quantites.forEach((quantite) => {
      total += quantite.prix;
    });
    return total;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <h2 className="text-xl font-bold text-gray-900">Liste des commandes</h2>
      
      <table className="mt-4 w-full text-gray-500 sm:mt-6">
        <caption className="sr-only">Products</caption>
        <thead className="text-left text-sm text-gray-500">
          <tr>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">
              Id
            </th>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">
              Price
            </th>
            <th scope="col" className="py-3 pr-2 font-bold w-1/5">
              Status
            </th>
            <th scope="col" className="py-3 font-bold">
              Info
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
          {commandes.map((commande) => (
            <tr key={commande.id}>
              <td className="py-6 pr-2 font-bold">
                {commande.id}
              </td>
              <td className="py-6 pr-2 sm:table-cell">{getPriceCommande(commande)} €</td>
              <td className="py-6 pr-2 sm:table-cell">{commande.status}</td>
              <td className="py-6 font-medium">
                <Link href={`/backoffice/commande/`+commande.id} className="text-indigo-600">
                  voir la commande
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeList;
