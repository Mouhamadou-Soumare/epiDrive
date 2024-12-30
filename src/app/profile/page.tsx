// src/app/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';

// Enregistrer les composants Chart.js
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// Fonction pour formater une date en dd/MM/yyyy
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ProfilePage() {
  return <ProfileContent />;
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status]);

  // Initialiser la date
  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  // Récupération des statistiques depuis l'API
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  // Données pour le graphique
  const chartData = {
    labels: stats?.purchaseHistory?.map((item: any) => item.date) || [],
    datasets: [
      {
        label: 'Achats journaliers',
        data: stats?.purchaseHistory?.map((item: any) => item.total) || [],
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
        text: "Nombre d'achats par jour",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
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
            <h2 className="text-2xl font-bold mb-6 text-black">
              Bienvenue sur Epidrive, {session?.user?.name}
            </h2>
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
                  <strong>Client depuis :</strong> {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-black">Statistiques de vos achats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">{stats?.ordersThisMonth || 0}</h4>
                <p className="text-black">Commandes ce mois-ci</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">{stats?.totalSpent || 0}€</h4>
                <p className="text-black">Total dépensé</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-600">{stats?.favoriteItems || 0}</h4>
                <p className="text-black">Articles favoris</p>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-black">Historique des achats</h3>
            <Line data={chartData} options={chartOptions} className="w-full h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
