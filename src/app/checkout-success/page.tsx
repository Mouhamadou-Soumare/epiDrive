"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { randomBytes } from "crypto";
import Image from 'next/image';
import groceryCheckout from "../../../public/img/grocery-checkout.webp";

export default function CheckoutSuccess() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<null | {
    items: { name: string; quantity: number; price: number; total: number }[];
    totalAmount: number;
    shippingAddress: {
      adresse: string;
      ville: string;
      codePostal: string;
      pays: string;
    };
  }>(null);
  const [loading, setLoading] = useState(true);

  const saveOrderToDatabase = async () => {
    if (!orderSummary) return;

    try {
      // Préparer les données pour l'API
      const produits = orderSummary.items.map((item) => ({
        name: item.name,
        quantite: item.quantity,
        prix: item.price,
      }));

      const commande = {
        status: "EN_ATTENTE",
        paymentId: randomBytes(16).toString("hex"),
        userId: 1, // Remplacez par l'ID utilisateur actuel si disponible
        infosAdresse: orderSummary.shippingAddress,
        produits,
      };

      // Envoyer la commande à l'API
      const response = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commande),
      });

      if (response.ok) {
        console.log("Commande enregistrée avec succès");
      } else {
        console.error("Erreur lors de l'enregistrement de la commande");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la commande :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Récupérer les informations de la commande
    const savedOrder = localStorage.getItem("orderSummary");
    if (savedOrder) {
      setOrderSummary(JSON.parse(savedOrder));
      localStorage.removeItem("orderSummary"); // Nettoyage après chargement
    }

    // Effacer les données du panier
    localStorage.removeItem("sessionId");
  }, []);

  useEffect(() => {
    // Sauvegarder la commande une fois les données récupérées
    if (orderSummary) {
      saveOrderToDatabase();
    }
  }, [orderSummary]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <p className="text-lg font-medium text-gray-700">Traitement de votre commande...</p>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <p className="text-lg font-medium text-gray-700">Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <main className="relative lg:min-h-full">
      <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
      <Image
          alt="Order success"
          src={groceryCheckout}
          className="size-full object-cover opacity-70"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-indigo-600">Paiement réussi</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Merci pour votre commande</p>
            <p className="mt-2 text-base text-gray-500">
              Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation sous peu.
            </p>

            <ul
              role="list"
              className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
            >
              {orderSummary.items.map((item, index) => (
                <li key={index} className="flex space-x-6 py-6">
                  <img
                    alt={item.name}
                    src="/placeholder.jpg" // Remplacez par une image dynamique si disponible
                    className="size-24 flex-none rounded-md bg-gray-100 object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-gray-900">{item.name}</h3>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                  <p className="flex-none font-medium text-gray-900">{item.total.toFixed(2)} €</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd className="text-gray-900">
                  {orderSummary.items
                    .reduce((acc, item) => acc + item.total, 0)
                    .toFixed(2)}{" "}
                  €
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">{orderSummary.totalAmount.toFixed(2)} €</dd>
              </div>
            </dl>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <button
                onClick={() => router.push("/")}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Retour à l'accueil <span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
