'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';

// Enregistrer les composants Chart.js
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function ProfilePage() {
  return <ProfileContent />;
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
    
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ordersRes, logsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/orders/recent'),
          fetch('/api/logs/recent'),
        ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        const logsData = await logsRes.json();

        setStats(statsData);
        setRecentOrders(ordersData);
        setActivityLogs(logsData);
      } catch (error) {
        console.error('Erreur de récupération des données:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  // Calcul du statut de fidélité
  const totalSpent = stats?.totalSpent || 0;
  const loyaltyStatus = totalSpent >= 500 ? 'Or' : totalSpent >= 250 ? 'Argent' : 'Bronze';
  const nextLevel = totalSpent >= 500 ? 1000 : totalSpent >= 250 ? 500 : 250;
  const progressPercentage = Math.min((totalSpent / nextLevel) * 100, 100);

  // Données pour le graphique
  const chartData = {
    labels: stats?.purchaseHistory.map((item: any) => item.date) || [],
    datasets: [
      {
        label: 'Achats journaliers',
        data: stats?.purchaseHistory.map((item: any) => item.total) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">Navigation</h2>
            <ul className="space-y-3">
              <li><Link href="/profile" className="text-blue-600 hover:text-blue-800">Mon Profil</Link></li>
              <li><Link href="/profile/orders" className="text-blue-600 hover:text-blue-800">Commandes</Link></li>
              <li><Link href="/profile/settings" className="text-blue-600 hover:text-blue-800">Paramètres</Link></li>
              <li>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600 hover:text-red-800">
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
              <img src={session?.user?.image || '/default-avatar.png'} alt="Avatar" className="w-24 h-24 rounded-full shadow-md" />
              <div>
                <p><strong>Email :</strong> {session?.user?.email}</p>
                <p><strong>Statut fidélité :</strong> {loyaltyStatus}</p>
                <div className="w-full bg-gray-200 rounded-full mt-2">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full" style={{ width: `${progressPercentage}%` }}>
                    {progressPercentage.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commandes récentes */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Vos commandes récentes</h3>
            <ul>
              {recentOrders.map((order) => (
                <li key={order.id} className="bg-gray-100 p-4 rounded-lg mb-2">
                  <p><strong>Commande #{order.id}</strong> - {order.total}€ - {order.status}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Journal des activités */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Journal des activités</h3>
            <ul>
              {activityLogs.map((log, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
                  <p>{log.action} - <span className="text-gray-600">{new Date(log.date).toLocaleString()}</span></p>
                </li>
              ))}
            </ul>
          </div>

          {/* Graphique */}
          <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Historique des achats</h3>
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
