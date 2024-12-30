'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Order {
  id: number;
  status: string;
  createdAt: string;
  total: number;
  products: { id: number; name: string; quantity: number; price: number }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error('Erreur API:', err))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || loading) return <LoadingSpinner />;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Vous devez être connecté pour voir vos commandes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Vos Commandes</h1>
        {orders.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-600">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-indigo-600">Commande #{order.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'Livrée'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  <strong>Date :</strong> {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Total :</strong> {order.total.toFixed(2)}€
                </p>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Produits :</h3>
                  <ul className="space-y-2">
                    {order.products.map((product) => (
                      <li
                        key={product.id}
                        className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
                      >
                        <span>{product.name}</span>
                        <span>
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
