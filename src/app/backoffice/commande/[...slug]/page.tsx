'use client';

import { CursorArrowRaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import ProduitRow from "../components/ProduitRow";
import { UpdateCommandeAlert } from '../components/UpdateCommandeAlert';
import { Commande, User, Produit } from "../../../types";

const CommandeDetail = () => {
  const { slug } = useParams(); 
  const [user, setUser] = useState<User | null>(null);
  const [commandePrice, setCommandePrice] = useState<number>(0);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);  
  const [messageCommandeAlert, setMessageCommandeAlert] = useState("");  
  const [openCommandeAlert, setOpenCommandeAlert] = useState(false);

  useEffect(() => {
    const fetchCommande = async () => {
      const commandeSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      try {
        const res = await fetch(`/api/commande/${commandeSlug}`);
        const data = await res.json();

        if (res.ok) {
          setCommande(data);
          setCommandePrice(data.quantites.reduce((total: number, quantite: { prix: number }) => total + quantite.prix, 0));
          await fetchUser(data.userId);
          setProduits(data.quantites.map((quantite: { produit: Produit; prix: number }) => ({ ...quantite.produit, prix: quantite.prix })));
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
  
  const handleUpdate = async (newStatus: string) => {
    if (commande) {
      try {
        const updatedCommande = { ...commande, status: newStatus };
        const res = await fetch(`/api/commande/${commande.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
  
        if (res.ok) {
          setCommande(updatedCommande);
          setMessageCommandeAlert(`Votre commande ${updatedCommande.id} est ${updatedCommande.status}`);
          setOpenCommandeAlert(true);
          console.log("Statut de la commande mis à jour avec succès !");
        } else {
          console.error("Erreur lors de la mise à jour de la commande :", await res.json());
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande :", error);
      }
    }
  };
  

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!commande) return <div className="lg:pl-72">Commande non trouvée</div>;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <UpdateCommandeAlert message={messageCommandeAlert} open={openCommandeAlert} setOpen={setOpenCommandeAlert} />
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
        {commande && (
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <CursorArrowRaysIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Statut de la commande</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <select
                value={commande.status}
                onChange={(e) => handleUpdate(e.target.value)}
                className="mt-2 block w-full px-3 py-2 text-base leading-6 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="livré">Livré</option>
                <option value="en cours de livraison">En cours de livraison</option>
                <option value="annulé">Annulé</option>
                <option value="en attente">En attente</option>
              </select>
            </dd>
          </div>
        )}
      </div>
      {/* Table of products */}
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
