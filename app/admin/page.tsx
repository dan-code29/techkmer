'use client';

import { useState, useEffect } from 'react';

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
      <h1 className="text-3xl font-bold mb-6">Demandes de devis</h1>
      {quotes.length === 0 ? (
        <p>Aucune demande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="border rounded p-4 shadow-sm">
              <p><strong>Nom :</strong> {quote.name}</p>
              <p><strong>Email :</strong> {quote.email}</p>
              <p><strong>Message :</strong> {quote.message}</p>
              <p><strong>Date :</strong> {new Date(quote.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}