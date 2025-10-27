"use client";

import LoaderComponent from "@/components/LoaderComponent";
import { useUserOrders } from "@/hooks/users/useUserOrders";
import { useSession } from "next-auth/react";
import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Utility to render a status badge with consistent colors/labels
function renderStatusBadge(status?: string | null) {
  const s = String(status ?? "").toLowerCase();
  let label = status ?? "Inconnu";
  let classes = "bg-gray-100 text-gray-700";

  if (s.includes("liv")) {
    label = "Livrée";
    classes = "bg-green-100 text-green-600";
  } else if (s.includes("prepar") || s.includes("en cours") || s.includes("en_preparation")) {
    label = "En préparation";
    classes = "bg-yellow-100 text-yellow-600";
  } else if (s.includes("attente")) {
    label = "En attente";
    classes = "bg-gray-100 text-gray-700";
  } else if (s.includes("exped") || s.includes("expédi") || s.includes("expedie")) {
    label = "Expédiée";
    classes = "bg-orange-100 text-orange-700";
  } else if (s.includes("annul")) {
    label = "Annulée";
    classes = "bg-red-100 text-red-600";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classes}`}>
      {label}
    </span>
  );
}

export default function OrdersPage() {
  return <OrdersContent />;
}

function OrdersContent() {
  const { orders, loading, error } = useUserOrders();
  const { data: session, status } = useSession();
  console.log(orders);
  if (status === "loading" || loading) return <LoaderComponent />;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Vous devez être connecté pour voir vos commandes.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center a-primary a-primary-hover font-medium transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 a-primary a-primary-hover" />
            Retour au profil
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {" "}
          Vos Commandes
        </h1>

        {/* Gestion des erreurs */}
        {error && (
          <div className="flex items-center justify-center bg-red-100 border border-red-400 text-red-600 text-lg font-semibold px-4 py-3 rounded-md">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            {error}
          </div>
        )}

        {/* Affichage des commandes */}
        {orders.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-md border">
            <p className="text-lg text-gray-600">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Titre + Statut */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-orange-400 flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-orange-400" />
                    <span>Commande #{order.id}</span>
                  </h2>
                  {renderStatusBadge(order.status)}
                </div>

                {/* Infos Générales */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <p className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <span>
                      <strong>Date :</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CurrencyEuroIcon className="h-5 w-5 text-gray-500" />
                    <span>
                      <strong>Total :</strong> {order.total.toFixed(2)}€
                    </span>
                  </p>
                </div>

                {/* Liste des Produits */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    🛍 Produits :
                  </h3>
                  <ul className="space-y-3 border-t border-gray-200 pt-3">
                    {order.products.map((product) => (
                      <li
                        key={product.id}
                        className="flex justify-between items-center text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md"
                      >
                        <span>{product.name}</span>
                        <span className="font-semibold">
                          {product.quantity} x {product.price.toFixed(2)}€
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
