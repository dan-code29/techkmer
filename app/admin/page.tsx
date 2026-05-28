'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuotes = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Mot de passe incorrect');
      }
      const data = await res.json();
      setQuotes(data);
      setAuthenticated(true);
      sessionStorage.setItem('adminPassword', pwd);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes(password);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('adminPassword');
    if (saved) {
      setPassword(saved);
      fetchQuotes(saved);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Accès administrateur</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      {/* Boutons de navigation */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">📦 Produits</h2>
          <div className="space-y-2">
            <Link href="/admin/products" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">
              Gérer les produits
            </Link>
            <Link href="/admin/products/new" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
              Ajouter un produit
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">🛒 Commandes</h2>
          <Link href="/admin/commandes" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
            Gérer les commandes
          </Link>
        </div>
      </div>

      {/* Devis */}
      <h2 className="text-2xl font-bold mb-4">Demandes de devis</h2>
      {quotes.length === 0 ? (
        <p className="text-gray-600">Aucune demande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="border rounded p-4 shadow-sm hover:shadow-md transition">
              <p><strong>Nom :</strong> {quote.name}</p>
              <p><strong>Email :</strong> <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">{quote.email}</a></p>
              <p><strong>Message :</strong> {quote.message}</p>
              <p className="text-sm text-gray-500"><strong>Date :</strong> {new Date(quote.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}