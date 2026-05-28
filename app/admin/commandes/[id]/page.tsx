'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
  paymentMethod: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  created_at: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        if (!res.ok) throw new Error('Commande non trouvée');
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Erreur : {error}</div>;
  if (!order) return <div className="p-8 text-center">Commande non trouvée</div>;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">⏳ En attente</span>;
      case 'processing': return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded">⚙️ En cours</span>;
      case 'delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded">✅ Livrée</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/admin/commandes" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Retour à la liste
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">Commande #{order.id}</h1>
                <p className="text-gray-600 text-sm">
                  {new Date(order.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <hr className="my-4" />

            {/* Informations client */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">👤 Informations client</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Nom</p>
                  <p className="font-semibold">{order.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p><a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">{order.email}</a></p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Téléphone</p>
                  <p><a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">{order.phone}</a></p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mode de paiement</p>
                  <p className={`font-semibold ${order.paymentMethod === 'delivery' ? 'text-blue-600' : 'text-green-600'}`}>
                    {order.paymentMethod === 'delivery' ? '💰 À la livraison' : '💳 En ligne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">📍 Adresse de livraison</h2>
              <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{order.address}</p>
            </div>

            {/* Articles */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">📦 Articles commandés</h2>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Article</th>
                    <th className="p-2 text-center">Quantité</th>
                    <th className="p-2 text-right">Prix unitaire</th>
                    <th className="p-2 text-right">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatPrice(item.price)}</td>
                      <td className="p-2 text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div>
          {/* Calendrier de livraison */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">📅 Livraison</h3>
            <p className="text-gray-600 text-sm mb-1">Date prévue</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              {new Date(order.deliveryDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500">
              Jours restants: {Math.ceil((new Date(order.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>

          {/* Résumé financier */}
          <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-semibold mb-4">💵 Résumé</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frais de port</span>
                <span>0 FCFA</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-green-600">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {order.paymentMethod === 'delivery' && (
              <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded text-sm">
                ℹ️ Paiement à effectuer à la livraison
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
