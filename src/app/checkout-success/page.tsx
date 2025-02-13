"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOrderSummary } from "@/hooks/checkout/useOrderSummary";
import { useSaveOrder } from "@/hooks/checkout/useSaveOrder";
import groceryCheckout from "../../../public/img/grocery-checkout.webp";
import LoaderComponent from "@/components/LoaderComponent";

export default function CheckoutSuccess() {
  const { data: session } = useSession();
  const { orderSummary, loading } = useOrderSummary();
  const { saveOrderToDatabase, saving, orderSaved } = useSaveOrder();
  const router = useRouter();

  const formattedOrderSummary = orderSummary
    ? {
        ...orderSummary,
        items: orderSummary.items.map((item) => ({
          id: item.id,
          quantite: item.quantity,
          prix: item.price,
          image: item.image,
        })),
      }
    : null;

  useEffect(() => {
    if (formattedOrderSummary && session?.user && !orderSaved) {
      saveOrderToDatabase(
        formattedOrderSummary,
        session.user.id,
        session.user.email ?? "no-reply@epidrive.com",
        session.user.name || "Cher client"
      );
    }
  }, [formattedOrderSummary, session, orderSaved]);

  if (loading || saving) {
    return <LoaderComponent />;
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <p className="text-lg font-medium text-gray-700">
          Aucune commande trouvée.
        </p>
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
            <h1 className="text-sm font-medium text-indigo-600">
              Paiement réussi
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Merci pour votre commande
            </p>
            <p className="mt-2 text-base text-gray-500">
              Votre commande a été enregistrée avec succès. Vous recevrez un
              email de confirmation sous peu.
            </p>

            <ul
              role="list"
              className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
            >
              {orderSummary.items.map((item, index) => (
                <li key={index} className="flex space-x-6 py-6 items-center">
                  <img
                    alt={item.name}
                    src={item.image}
                    className="size-32 flex-none rounded-md bg-gray-100 object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-gray-900">{item.name}</h3>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                  <p className="flex-none font-medium text-gray-900">
                    {item.total.toFixed(2)} €
                  </p>
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
                <dd className="text-base">
                  {orderSummary.totalAmount.toFixed(2)} €
                </dd>
              </div>
            </dl>

            <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-900">
                  Adresse de livraison
                </dt>
                <dd className="mt-2">
                  <address className="not-italic">
                    <span className="block">
                      {orderSummary.shippingAddress.adresse}
                    </span>
                    <span className="block">
                      {orderSummary.shippingAddress.ville}
                    </span>
                    <span className="block">
                      {orderSummary.shippingAddress.codePostal},{" "}
                      {orderSummary.shippingAddress.pays}
                    </span>
                  </address>
                </dd>
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
