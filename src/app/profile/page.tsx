// src/app/profile/page.tsx

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';

// Enregistrer les composants Chart.js
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

import { SessionProvider } from 'next-auth/react';

export default function ProfilePage() {
  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  );
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return <LoadingSpinner />;
  }

  // Exemple de données pour les statistiques du graphique
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Achats mensuels',
        data: [20, 35, 40, 25, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Nombre d\'achats par mois',
      },
    },
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar - Navigation du tableau de bord */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">Navigation</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/profile" className="text-blue-600 hover:text-blue-800">
                  Mon Profil
                </Link>
              </li>
              <li>
                <Link href="/profile/orders" className="text-blue-600 hover:text-blue-800">
                  Commandes
                </Link>
              </li>
              <li>
                <Link href="/profile/settings" className="text-blue-600 hover:text-blue-800">
                  Paramètres
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-600 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>

          {/* Carte de profil */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-black">Bienvenue sur Epidrive, {session?.user?.name}</h2>
            <div className="flex items-center space-x-6">
              <img
                src={session?.user?.image || '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full shadow-md"
              />
              <div>
                <p className="text-black">
                  <strong>Email :</strong> {session?.user?.email}
                </p>
                <p className="text-black">
                  <strong>Client depuis :</strong> {'Date inconnue'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/profile/edit">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
                  Modifier le profil
                </button>
              </Link>
            </div>
          </div>

          {/* Section des statistiques */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-black">Statistiques de vos achats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">15</h4>
                <p className="text-black">Commandes ce mois-ci</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">320€</h4>
                <p className="text-black">Total dépensé</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">8</h4>
                <p className="text-black">Articles favoris</p>
              </div>
            </div>
          </div>

          {/* Graphique des achats */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-black">Historique des achats</h3>
            <Line data={chartData} options={chartOptions} className="w-full h-64" />
          </div>

          {/* Section des commandes récentes */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-black">Commandes récentes</h3>
            <ul className="space-y-2">
              <li className="bg-gray-200 p-4 rounded-lg">
                <p className="text-black">
                  <strong>Commande #12345</strong> - 5 articles - 45€ - Livrée le 15 novembre 2024
                </p>
              </li>
              <li className="bg-gray-200 p-4 rounded-lg">
                <p className="text-black">
                  <strong>Commande #12346</strong> - 2 articles - 20€ - En cours de préparation
                </p>
              </li>
              <li className="bg-gray-200 p-4 rounded-lg">
                <p className="text-black">
                  <strong>Commande #12347</strong> - 8 articles - 80€ - En attente de livraison
                </p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
