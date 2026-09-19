'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FaBox, FaShoppingCart, FaFileAlt, FaUsers, FaPlus, FaChartLine,
  FaEnvelope, FaPhone, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaArrowRight, FaSearch, FaSync,
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type Quote = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
  service_type?: string;
  lieu?: string;
  app_total?: number;
  client_total?: number;
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'with-email'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  /* ---------- Récupération des devis ---------- */
  const fetchQuotes = async (pwd: string) => {
    setLoading(true);
    setError('');
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
  }, [refreshKey]);

  /* ---------- Statistiques ---------- */
  const stats = useMemo(() => {
    const total = quotes.length;
    const withEmail = quotes.filter((q) => q.email).length;
    const today = quotes.filter((q) => {
      const d = new Date(q.created_at);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;
    const last7days = quotes.filter((q) => {
      const d = new Date(q.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }).length;
    return { total, withEmail, today, last7days };
  }, [quotes]);

  /* ---------- Filtrage ---------- */
  const filteredQuotes = useMemo(() => {
    let list = [...quotes];

    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      list = list.filter((q) => new Date(q.created_at) >= weekAgo);
    } else if (filter === 'with-email') {
      list = list.filter((q) => q.email);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.name?.toLowerCase().includes(s) ||
          q.email?.toLowerCase().includes(s) ||
          q.phone?.toLowerCase().includes(s) ||
          q.message?.toLowerCase().includes(s)
      );
    }

    return list;
  }, [quotes, search, filter]);

  const formatFCFA = (n?: number) =>
    n ? new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA' : '—';

  /* ============================================================ */
  /*  ÉCRAN DE CONNEXION                                          */
  /* ============================================================ */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-[#0066FF]/40">
              WB
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Administration</h1>
            <p className="text-sm text-gray-400">WISE BUILD Smart Systems</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050B16] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#00C2FF] mb-4"
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-3 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066FF] hover:bg-[#0052cc] disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ============================================================ */
  /*  DASHBOARD                                                    */
  /* ============================================================ */
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ============ EN-TÊTE DASHBOARD ============ */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#0066FF] uppercase tracking-widest mb-1">
                Administration
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#050B16]">
                Tableau de bord
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0066FF] px-3 py-2 rounded-lg transition border border-gray-200 hover:border-[#00C2FF]"
              >
                <FaSync size={12} /> Rafraîchir
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminPassword');
                  setAuthenticated(false);
                }}
                className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ============ STATS CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FaFileAlt}
            label="Total devis"
            value={stats.total}
            color="text-[#0066FF]"
            bg="bg-blue-50"
          />
          <StatCard
            icon={FaClock}
            label="Aujourd'hui"
            value={stats.today}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            icon={FaChartLine}
            label="7 derniers jours"
            value={stats.last7days}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            icon={FaEnvelope}
            label="Avec email"
            value={stats.withEmail}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>

        {/* ============ ACTIONS RAPIDES ============ */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0066FF] mb-4">
            Actions rapides
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              icon={FaBox}
              title="Produits"
              desc="Gérer le catalogue"
              href="/admin/products"
              gradient="from-[#0066FF] to-[#00C2FF]"
            />
            <QuickAction
              icon={FaPlus}
              title="Nouveau produit"
              desc="Ajouter au catalogue"
              href="/admin/products/new"
              gradient="from-green-600 to-emerald-500"
            />
            <QuickAction
              icon={FaShoppingCart}
              title="Commandes"
              desc="Suivre les commandes"
              href="/admin/commandes"
              gradient="from-purple-600 to-indigo-500"
            />
            <QuickAction
              icon={FaUsers}
              title="Utilisateurs"
              desc="Gérer les comptes"
              href="/admin/users"
              gradient="from-orange-600 to-amber-500"
            />
          </div>
        </div>

        {/* ============ DEVIS ============ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-lg font-bold text-[#050B16] flex items-center gap-2">
                <FaFileAlt className="text-[#0066FF]" />
                Demandes de devis
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredQuotes.length} résultat{filteredQuotes.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Recherche */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#00C2FF] w-56"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'recent', label: 'Récents' },
                { id: 'with-email', label: 'Avec email' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filter === f.id
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="p-6">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-16">
                <FaExclamationTriangle className="text-gray-300 mx-auto mb-3" size={40} />
                <p className="text-gray-500">
                  {quotes.length === 0
                    ? 'Aucune demande pour le moment.'
                    : 'Aucun résultat pour cette recherche.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} formatFCFA={formatFCFA} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SOUS-COMPOSANTS                                                    */
/* ------------------------------------------------------------------ */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
      <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} />
      </div>
      <p className="text-3xl font-bold text-[#050B16]">{value}</p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  desc,
  href,
  gradient,
}: {
  icon: any;
  title: string;
  desc: string;
  href: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`group bg-gradient-to-br ${gradient} text-white rounded-2xl p-5 shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
    >
      <Icon className="mb-3 opacity-90" size={28} />
      <p className="font-bold text-base leading-tight">{title}</p>
      <p className="text-xs text-white/80 mt-1">{desc}</p>
      <span className="inline-flex items-center gap-1 text-xs font-bold mt-3 group-hover:gap-2 transition-all">
        Ouvrir <FaArrowRight size={10} />
      </span>
    </Link>
  );
}

function QuoteCard({
  quote,
  formatFCFA,
}: {
  quote: Quote;
  formatFCFA: (n?: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(quote.created_at);
  const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;

  return (
    <div
      className={`border rounded-xl transition hover:shadow-md ${
        isRecent ? 'border-[#00C2FF]/50 bg-cyan-50/30' : 'border-gray-100 bg-white'
      }`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {quote.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-[#050B16]">{quote.name}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
                {quote.phone && (
                  <a href={`tel:${quote.phone}`} className="flex items-center gap-1 hover:text-[#0066FF]">
                    <FaPhone size={10} /> {quote.phone}
                  </a>
                )}
                {quote.email && (
                  <a href={`mailto:${quote.email}`} className="flex items-center gap-1 hover:text-[#0066FF]">
                    <FaEnvelope size={10} /> {quote.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isRecent && (
              <span className="bg-[#00C2FF] text-[#050B16] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                Nouveau
              </span>
            )}
            {quote.service_type && (
              <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded uppercase">
                {quote.service_type}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <p className={`text-sm text-gray-700 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
          {quote.message}
        </p>

        {(quote.app_total || quote.client_total || quote.lieu) && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            {quote.lieu && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                📍 {quote.lieu}
              </span>
            )}
            {quote.app_total && (
              <span className="bg-[#0066FF]/10 text-[#0066FF] px-2 py-1 rounded font-semibold">
                App : {formatFCFA(quote.app_total)}
              </span>
            )}
            {quote.client_total && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-semibold">
                Client : {formatFCFA(quote.client_total)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-[#0066FF] hover:underline"
          >
            {expanded ? 'Voir moins' : 'Voir plus'}
          </button>
          <a
            href={`https://wa.me/${quote.phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-green-600 hover:underline ml-auto"
          >
            💬 WhatsApp
          </a>
          <a
            href={`mailto:${quote.email}`}
            className="text-xs font-semibold text-[#0066FF] hover:underline"
          >
            📧 Répondre
          </a>
        </div>
      </div>
    </div>
  );
}