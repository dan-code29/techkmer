'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
  paymentMethod: string;
  items: string;
  totalPrice: number;
  status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'delivered'>('all');
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const fetchOrders = async (password: string | null) => {
    if (!password) {
      setError('Entrez votre mot de passe admin pour voir les commandes.');
      setLoading(false);
      setHasAccess(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${password}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setHasAccess(false);
        throw new Error(data?.error || 'Impossible de charger les commandes');
      }
      if (!Array.isArray(data)) {
        setHasAccess(false);
        throw new Error('Réponse inattendue du serveur');
      }
      setOrders(data);
      setHasAccess(true);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (password: string) => {
    setLoading(true);
    setError('');
    setAdminPassword(password);
    sessionStorage.setItem('adminPassword', password);
    await fetchOrders(password);
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('adminPassword');
    setAdminPassword(savedPassword);
    fetchOrders(savedPassword);
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!adminPassword) {
      alert('Connectez-vous depuis /admin pour modifier une commande.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Erreur lors de la mise à jour');
      }
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Erreur: ' + (err as Error).message);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    if (!adminPassword) {
      alert('Connectez-vous depuis /admin pour supprimer une commande.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Erreur suppression');
      }
      
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      alert('Erreur: ' + (err as Error).message);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-4">Accès administrateur</h1>
        <p className="mb-4 text-gray-600">Pour voir les commandes clients, entrez votre mot de passe administrateur.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdminLogin(passwordInput);
          }}
          className="space-y-4 bg-white rounded shadow p-6"
        >
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border rounded p-3"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des commandes</h1>
        <button 
          onClick={() => fetchOrders(adminPassword)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔄 Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded transition ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Toutes ({orders.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded transition ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          En attente ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('processing')}
          className={`px-4 py-2 rounded transition ${statusFilter === 'processing' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
        >
          En cours ({orders.filter(o => o.status === 'processing').length})
        </button>
        <button
          onClick={() => setStatusFilter('delivered')}
          className={`px-4 py-2 rounded transition ${statusFilter === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Livrée ({orders.filter(o => o.status === 'delivered').length})
        </button>
      </div>

      {/* Table des commandes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">ID</th>
              <th className="p-3 border text-left">Client</th>
              <th className="p-3 border text-left">Téléphone</th>
              <th className="p-3 border text-right">Montant</th>
              <th className="p-3 border text-center">Livraison</th>
              <th className="p-3 border text-center">Paiement</th>
              <th className="p-3 border text-center">Statut</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Aucune commande
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">#{order.id}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{order.name}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                      {order.phone}
                    </a>
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-white text-sm ${
                      order.paymentMethod === 'delivery' 
                        ? 'bg-blue-600' 
                        : 'bg-green-600'
                    }`}>
                      {order.paymentMethod === 'delivery' ? 'À la livraison' : 'En ligne'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-white border-0 cursor-pointer ${
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'processing' ? 'bg-orange-500' :
                        'bg-green-600'
                      }`}
                    >
                      <option value="pending">⏳ En attente</option>
                      <option value="processing">⚙️ En cours</option>
                      <option value="delivered">✅ Livrée</option>
                    </select>
                  </td>
                  <td className="p-3 text-center space-x-1">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block text-sm"
                    >
                      Détails
                    </Link>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statistiques */}
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total commandes</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Montant total</p>
          <p className="text-2xl font-bold">{formatPrice(orders.reduce((sum, o) => sum + o.totalPrice, 0))}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-600">
          <p className="text-sm text-gray-600">Paiements en ligne</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.paymentMethod === 'online').length}</p>
        </div>
      </div>
    </div>
  );
}
