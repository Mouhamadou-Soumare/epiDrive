'use client';

import { CursorArrowRaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import CommandeCard from "../components/CommandeCard";
import { Commande, User } from "../../../types";

const UserDetail = () => {
  const { slug } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [commandePrice, setCommandePrice] = useState<number>(0);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchCommande = async () => {
      const userSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

      try {
        const res = await fetch(`/api/users/${userSlug}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setCommandes(data.commandes);
          setCommandePrice(data.commandes.reduce((total: number, cmd: Commande) => 
            total + cmd.quantites.reduce((cmdTotal: number, qte) => cmdTotal + qte.prix, 0), 0));
        } else {
          console.error('Error fetching user:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!user) return <div className="lg:pl-72">Utilisateur non trouvé</div>;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {user && (
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-3 shadow sm:px-6 sm:pt-5">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <UsersIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{user.email}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{user.username}</p>
            </dd>
          </div>
        )}
        {commandePrice > 0 && (
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-3 shadow sm:px-6 sm:pt-5">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <CursorArrowRaysIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Total des commandes</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{commandePrice} €</p>
            </dd>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Détails des commandes</h2>
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
              <CommandeCard key={commande.id} commande={commande} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetail;
