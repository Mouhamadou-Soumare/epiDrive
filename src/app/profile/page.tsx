"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import LoaderComponent from "@/components/LoaderComponent";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import {
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Role, User } from "types";
import { useGetUser } from "@/hooks/users/useUsers";

export default function ProfilePage() {
  return <ProfileContent />;
}

function ProfileContent() {
  const { session, status, stats, loading, currentDate } = useUserProfile();
  const {
    user,
    loading: userLoading,
    error,
  } = useGetUser(session?.user?.id ? Number(session.user.id) : null) as {
    user: User | null;
    loading: boolean;
    error: any;
  };

  if (status === "loading" || loading || userLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 🔹 Sidebar Navigation */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Mon compte
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
                <Link
                  href="/profile/orders"
                  className="text-gray-700 hover:text-orange-700 font-medium"
                >
                  Mes commandes
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-600" />
                <Link
                  href="/profile/settings"
                  className="text-gray-700 hover:text-orange-700 font-medium"
                >
                  Paramètres
                </Link>
              </li>
              {user?.role === Role.ADMIN && (
                <li className="flex items-center space-x-2">
                  <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                  <a
                    href="/backoffice"
                    className="text-gray-700 hover:text-orange-700 font-medium"
                  >
                    Dashboard
                  </a>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                <button
                  onClick={async () => {
                    await signOut();
                    window.location.href =
                      process.env.NEXT_PUBLIC_BASE_URL || "/";
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>

          {/* 🔹 Carte Profil Utilisateur */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Bienvenue, {user.username || "Utilisateur"}
            </h2>

            <div className="flex items-center space-x-6">
              {/* Avatar Utilisateur */}
              <div className="relative">
                <img
                  src={"/default-avatar.png"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full shadow-md border border-gray-300"
                />
              </div>

              {/* Informations Utilisateur */}
              <div className="text-gray-700 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  <p className="text-sm font-medium">{user.email}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <p className="text-sm font-medium">
                    Client depuis : {currentDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Statistiques des achats */}
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-lg mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Mes statistiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-blue-100 p-6 rounded-lg text-center">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="text-2xl font-bold text-blue-600">
                  {stats?.ordersThisMonth || 0}
                </h4>
                <p className="text-gray-700">Commandes total</p>
              </div>

              <div className="bg-green-100 p-6 rounded-lg text-center">
                <CurrencyEuroIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="text-2xl font-bold text-green-600">
                  {stats?.totalSpent || 0}€
                </h4>
                <p className="text-gray-700">Total dépensé</p>
              </div>

              <div className="bg-yellow-100 p-6 rounded-lg text-center">
                <UserIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="text-2xl font-bold text-yellow-600">Premium</h4>
                <p className="text-gray-700">Statut du compte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
