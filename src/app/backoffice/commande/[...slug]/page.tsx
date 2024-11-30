'use client';

import { CursorArrowRaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import ProduitRow from "../components/ProduitRow";
import { UpdateCommandeAlert } from '../components/UpdateCommandeAlert';
import { useGetCommande, useUpdateCommande } from "@/hooks/commandes/useCommandes";
import { useGetUser } from "@/hooks/users/useUsers";
import { useParams } from 'next/navigation';
import { Commande, Produit, User, CommandeStatus } from "types";
import { useState } from 'react';

const CommandeDetail = () => {
  const { slug } = useParams() as { slug: string | string[] };
  const commandeSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  // Utilisation des hooks pour les données de commande et utilisateur
  const { commande, loading: commandeLoading, error: commandeError } = useGetCommande(commandeSlug) as {
    commande: Commande | null;
    loading: boolean;
    error: string | null;
  };

  const { updateCommande, loading: updatingCommande } = useUpdateCommande();

  const { user, loading: userLoading, error: userError } = useGetUser(commande?.fk_userId) as {
    user: User | null;
    loading: boolean;
    error: string | null;
  };

  // Gestion des alertes
  const [messageCommandeAlert, setMessageCommandeAlert] = useState("");
  const [openCommandeAlert, setOpenCommandeAlert] = useState(false);

  // Calcul du total de la commande
  const commandePrice = commande?.quantites?.reduce(
    (total, quantite) => total + quantite.prix,
    0
  ) || 0;

  // Préparation des produits associés
  const produits: Produit[] = commande?.quantites?.map(quantite => ({
    ...quantite.produit,
    prix: quantite.prix,
  })) || [];

  // Gestion de la mise à jour du statut
  const handleUpdateStatus = async (newStatus: CommandeStatus) => {
    if (commande) {
      try {
        await updateCommande(commandeSlug, { ...commande, status: newStatus });
        setMessageCommandeAlert(`Le statut de la commande ${commande.id} est maintenant "${newStatus}".`);
        setOpenCommandeAlert(true);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande :", error);
      }
    }
  };

  // Gestion des états de chargement et des erreurs
  if (commandeLoading || userLoading || updatingCommande) {
    return <div className="lg:pl-72">Chargement...</div>;
  }

  if (commandeError || !commande) {
    return <div className="lg:pl-72">Commande non trouvée ou erreur lors du chargement.</div>;
  }

  if (userError || !user) {
    return <div className="lg:pl-72">Utilisateur non trouvé ou erreur lors du chargement.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      {/* Alerte pour la mise à jour */}
      <UpdateCommandeAlert message={messageCommandeAlert} open={openCommandeAlert} setOpen={setOpenCommandeAlert} />

      {/* Informations sur l'utilisateur et la commande */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte utilisateur */}
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

        {/* Carte total commande */}
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

        {/* Carte statut commande */}
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
              onChange={(e) => handleUpdateStatus(e.target.value as unknown as CommandeStatus)}
              className="mt-2 block w-full px-3 py-2 text-base leading-6 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(CommandeStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </dd>
        </div>
      </div>

      {/* Table des produits */}
      <div className="mt-6">
        <h1 className="text-base font-semibold text-gray-900">Détails de la commande</h1>
        <div className="mt-8 flow-root">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Id</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {produits.map((produit) => (
                <ProduitRow key={produit.id} produit={produit} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommandeDetail;
