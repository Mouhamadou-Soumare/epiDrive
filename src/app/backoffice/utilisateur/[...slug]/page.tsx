'use client';

import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";

import { Commande, User, QuantiteCommande } from "../../../types";

const UserDetail = () => {
  const { slug } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [commandePrice, setCommandePrice] = useState<number>(0);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchCommande = async () => {
      const userSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      console.log('Fetching user for slug:', userSlug);

      try {
        const res = await fetch(`/api/users/${userSlug}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setCommandes(data.commandes);
          setCommandePrice(getTotalPriceCommande(data.commandes));
        } else {
          console.error('Error fetching user:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    const getTotalPriceCommande = (commandes: Commande | null): number => {
      if (commandes) {
        var prixTotal = 0;
        commandes.forEach((commande) => {
          prixTotal += commande.quantites.reduce((total: number, quantite: { prix: number; }) => total + quantite.prix, 0);
        });

        return prixTotal;
      }

      return 0;
    };

    fetchCommande();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!user) return <div className="lg:pl-72">User non trouvée</div>;

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
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {user && (
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <UsersIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{user.email}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{user.username}</p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <Link href={`/backoffice/utilisateur/${user.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                  View l'utilisateur
                </Link>
              </div>
            </dd>
          </div>
        )}
        {commandePrice > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <CursorArrowRaysIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Total coûts commandes</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{commandePrice} €</p>
            </dd>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
        <table className="mt-4 w-full text-gray-500 sm:mt-6">
          <thead className="text-left text-sm text-gray-500">
            <tr>
              <th scope="col" className="py-3 pr-2 font-bold w-1/5">Id</th>
              <th scope="col" className="py-3 pr-2 font-bold w-1/5">Price</th>
              <th scope="col" className="py-3 pr-2 font-bold w-1/5">Statut</th>
              <th scope="col" className="py-3 font-bold">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
            {commandes.map((commande) => (
              <tr key={commande.id}>
                <td className="py-6 pr-2 font-bold">{commande.id}</td>
                <td className="py-6 pr-2 sm:table-cell">{getPriceCommande(commande)} €</td>
                <td className="py-6 pr-2 sm:table-cell">{commande.status}</td>
                <td className="py-6 font-medium">
                  <Link href={`/backoffice/commande/${commande.id}`} className="text-indigo-600">
                    Voir la commande
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetail;
