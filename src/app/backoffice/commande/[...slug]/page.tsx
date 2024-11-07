'use client';

import { CursorArrowRaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import ProduitRow from "../components/ProduitRow";
import { Commande, User, Produit } from "../../../types";

const CommandeDetail = () => {
  const { slug } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [commandePrice, setCommandePrice] = useState<number>(0);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchCommande = async () => {
      const commandeSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

      try {
        const res = await fetch(`/api/commande/${commandeSlug}`);
        const data = await res.json();

        if (res.ok) {
          setCommande(data);
          setCommandePrice(data.quantites.reduce((total: number, quantite: { prix: any; }) => total + quantite.prix, 0));
          await fetchUser(data.userId);
          setProduits(data.quantites.map((quantite: { produit: Produit; prix: number; }) => ({ ...quantite.produit, prix: quantite.prix })));
        } else {
          console.error('Erreur lors de la récupération de la commande:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async (userId: number) => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error('Erreur lors de la récupération de l\'utilisateur:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    fetchCommande();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!commande) return <div className="lg:pl-72">Commande non trouvée</div>;

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
                  Voir l'utilisateur
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
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Total</p>
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
              <th scope="col" className="py-3 pr-2 font-bold w-1/5">Nom</th>
              <th scope="col" className="py-3 pr-2 font-bold w-1/5">Prix</th>
              <th scope="col" className="py-3 font-bold">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
            {produits.map((produit) => (
              <ProduitRow key={produit.id} produit={produit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommandeDetail;
