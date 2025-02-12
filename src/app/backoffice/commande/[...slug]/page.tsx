'use client';

import { CursorArrowRaysIcon, EyeIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import ProduitRow from "../components/ProduitRow";
import { UpdateCommandeAlert } from '../components/UpdateCommandeAlert';
import { useGetCommande, useUpdateCommande } from "@/hooks/commandes/useCommandes";
import { useCommandeUpdates } from "@/hooks/commandes/useCommandeUpdates";
import { useGetUser } from "@/hooks/users/useUsers";
import { useParams } from 'next/navigation';
import { Commande, Produit, User, CommandeStatus } from "types";
import { useEffect, useState } from 'react';

const CommandeDetail = () => {
  const { slug } = useParams() as { slug: string | string[] };
  const commandeSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  // Utilisation des hooks pour les données de commande et utilisateur
  const { commande, loading: commandeLoading, error: commandeError } = useGetCommande(commandeSlug) as {
    commande: Commande | null;
    loading: boolean;
    error: string | null;
  };

  const [localCommande, setLocalCommande] = useState<Commande | null>(null);
  useEffect(() => {
    if (commande) {
      setLocalCommande(commande);
    }
  }, [commande]); // Met à jour dès que `commande` est chargée

  const { updatedCommande } = useCommandeUpdates();

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
  const commandePrice = (commande?.quantites?.reduce(
    (total, quantite) => total + quantite.prix,
    0
  ) || 0).toFixed(2);

  // Préparation des produits associés
  const produits: Produit[] = commande?.quantites?.map(quantite => ({
    ...quantite.produit,
    prix: quantite.prix,
  })) || [];

  // Gestion de la mise à jour du statut
  /*
  const handleUpdateStatus = async (newStatus: CommandeStatus) => {
    if (commande) {
      try {
        await updateCommande(commande.id, { ...commande, status: newStatus });
        setMessageCommandeAlert(`Le statut de la commande ${commande.id} est maintenant "${newStatus}".`);
        setOpenCommandeAlert(true);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande :", error);
      }
    }
  };
  */


  useEffect(() => {
    if (updatedCommande && updatedCommande.id === localCommande?.id) {
      console.log("🔄 Mise à jour en temps réel de la commande :", updatedCommande);
      setLocalCommande(updatedCommande);
    }
  }, [updatedCommande, localCommande]); // 🔥 Remplacement de `commande` par `localCommande`  

  const handleUpdateStatus = async (newStatus: CommandeStatus) => {
    if (commande) {
      try {
        const updatedCommande = await updateCommande(commande.id, { ...commande, status: newStatus });
  
        // Mise à jour immédiate en local
        setLocalCommande(updatedCommande);
  
        setMessageCommandeAlert(`Le statut de la commande ${commande.id} est maintenant "${newStatus}".`);
        setOpenCommandeAlert(true);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande :", error);
      }
    }
  };
  

  // Logs pour débogage
  useEffect(() => {
    console.log("Commande :", commande);
    console.log("Utilisateur :", user?.username);
    console.log("ID Commande :", commande?.id);
  }, [commande, user]);

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
      <UpdateCommandeAlert
        message={messageCommandeAlert}
        open={openCommandeAlert}
        setOpen={setOpenCommandeAlert}
        user={user} // Passe l'utilisateur récupéré
        commandeId={commande.id} // Passe l'ID de la commande
      />

      {/* Informations sur l'utilisateur et la commande */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte utilisateur */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md button-primary p-3">
              <UsersIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{user.email}</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{user.username}</p>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <Link href={`/backoffice/utilisateur/${user.id}`} className="font-medium a-primary svg-hover flex flex-row items-center">
                Voir l'utilisateur         <EyeIcon className="pl-3 h-8 w-8"/>
              </Link>
            </div>
          </dd>
        </div>

        {/* Carte total commande */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md button-primary p-3">
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
            <div className="absolute rounded-md button-primary p-3">
              <CursorArrowRaysIcon aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Statut de la commande</p>
          </dt>
          <dd className="ml-16 flex items-center pb-6 sm:pb-7">
            <div className="relative w-full">
              <select
              value={localCommande?.status || ""}
              onChange={(e) => handleUpdateStatus(e.target.value as unknown as CommandeStatus)}
              className="appearance-none block w-full px-4 py-3 text-base leading-6 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 cursor-pointer transition duration-200 hover:bg-gray-50"
              >
                {Object.values(CommandeStatus)
                  .filter((status) => typeof status === "string") // 🔥 Filtrer les nombres
                  .map((status) => (
                    <option key={status} value={status} className="text-gray-900">
                      {status}
                    </option>
                  ))}
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.357a.75.75 0 011.08 1.042l-4 4.696a.75.75 0 01-1.08 0l-4-4.696a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
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
