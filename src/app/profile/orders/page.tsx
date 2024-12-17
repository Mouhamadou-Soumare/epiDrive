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
    return <p>Vous devez être connecté pour voir vos commandes.</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Vos Commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-blue-600">Commande #{order.id}</h2>
              <p>
                <strong>Statut :</strong> {order.status}
              </p>
              <p>
                <strong>Date :</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total :</strong> {order.total.toFixed(2)}€
              </p>
              <ul className="mt-2">
                {order.products.map((product) => (
                  <li key={product.id} className="text-sm text-gray-600">
                    {product.name} - Quantité: {product.quantity} - {product.price}€
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
