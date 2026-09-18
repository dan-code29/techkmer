'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

/* ------------------------------------------------------------------ */
/*  Domaines pour lesquels un devis peut être demandé                 */
/* ------------------------------------------------------------------ */
const QUOTE_DOMAINS = [
  { id: 'electricite', label: 'Électricité', icon: '⚡' },
  { id: 'solaire', label: 'Énergie solaire', icon: '☀️' },
  { id: 'reseau', label: 'Réseau & Informatique', icon: '🌐' },
  { id: 'securite', label: 'Sécurité électronique', icon: '🛡️' },
  { id: 'domotique', label: 'Domotique & Smart Building', icon: '🏠' },
  { id: 'automatisme', label: 'Automatisme (portails, portes)', icon: '🚪' },
  { id: 'cctv', label: 'Vidéosurveillance', icon: '📹' },
  { id: 'autre', label: 'Autre', icon: '📌' },
];

/* ------------------------------------------------------------------ */
/*  Les 10 régions du Cameroun + Autres pays                          */
/* ------------------------------------------------------------------ */
const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest',
];

const LABOR_PERCENT = 15; // Taux fixe proposé par WISE BUILD, non modifiable

type QuoteItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */
export default function DevisPage() {
  const { items: cartItems } = useCart();

  /* --- Section 1 : contact + domaine + région + description --- */
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    domaine: 'electricite',
    region: 'Littoral',
    otherCountry: '', // utilisé seulement si region === 'Autres pays'
    message: '',
    desiredDate: '',
    source: '',
  });

  /* --- Section 2 : articles --- */
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '1' });

  /* --- Section 3 : proposition client (main d'œuvre) --- */
  const [clientProposal, setClientProposal] = useState({
    enabled: false,
    type: 'percent' as 'percent' | 'fixed',
    value: '',
  });

  /* --- État global --- */
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /* -------------------------------------------------------------- */
  /*  Calculs                                                        */
  /* -------------------------------------------------------------- */
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const appLaborAmount = useMemo(
    () => Math.round(subtotal * (LABOR_PERCENT / 100)),
    [subtotal]
  );

  const appTotal = subtotal + appLaborAmount;

  const clientLaborAmount = useMemo(() => {
    if (!clientProposal.enabled || !clientProposal.value) return null;
    const value = parseFloat(clientProposal.value);
    if (isNaN(value) || value < 0) return null;
    return clientProposal.type === 'percent'
      ? Math.round(subtotal * (value / 100))
      : Math.round(value);
  }, [clientProposal, subtotal]);

  const clientTotal =
    clientLaborAmount !== null ? subtotal + clientLaborAmount : null;

  const formatFCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  /* -------------------------------------------------------------- */
  /*  Handlers                                                       */
  /* -------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isValidCameroonPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    return /^(?:\+237|237)?[6-9][0-9]{8}$/.test(cleaned);
  };

  const importCart = () => {
    const mapped: QuoteItem[] = cartItems.map((c) => ({
      id: `cart-${c.id}`,
      name: c.name,
      price: c.price,
      quantity: c.quantity,
    }));
    setItems((prev) => {
      const merged = [...prev];
      mapped.forEach((m) => {
        const found = merged.find((x) => x.id === m.id);
        if (found) found.quantity += m.quantity;
        else merged.push(m);
      });
      return merged;
    });
  };

  const addCustomItem = () => {
    const price = parseFloat(newItem.price);
    const qty = parseInt(newItem.quantity) || 1;
    if (!newItem.name.trim() || isNaN(price) || price < 0) return;
    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: newItem.name.trim(), price, quantity: qty },
    ]);
    setNewItem({ name: '', price: '', quantity: '1' });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  /* -------------------------------------------------------------- */
  /*  Soumission                                                     */
  /* -------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!formData.phone || !isValidCameroonPhone(formData.phone)) {
      setStatus('error');
      setErrorMessage(
        'Veuillez entrer un numéro camerounais valide (ex: 6XXXXXXXX ou +2376XXXXXXXX).'
      );
      return;
    }

    if (formData.region === 'Autres pays' && !formData.otherCountry.trim()) {
      setStatus('error');
      setErrorMessage('Veuillez préciser le nom de votre pays.');
      return;
    }

    if (items.length === 0) {
      setStatus('error');
      setErrorMessage(
        'Veuillez ajouter au moins un article (importez le panier ou ajoutez manuellement).'
      );
      return;
    }

    // Lieu final (région ou pays)
    const finalLieu =
      formData.region === 'Autres pays'
        ? formData.otherCountry.trim()
        : formData.region;

    const payload = {
      ...formData,
      lieu: finalLieu,
      items,
      subtotal,
      laborPercent: LABOR_PERCENT,
      appLaborAmount,
      appTotal,
      clientProposal: clientProposal.enabled
        ? {
            type: clientProposal.type,
            value: parseFloat(clientProposal.value) || 0,
            laborAmount: clientLaborAmount,
            total: clientTotal,
          }
        : null,
    };

    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');

      setStatus('success');
      setFormData({
        lastName: '', firstName: '', email: '', phone: '',
        domaine: 'electricite', region: 'Littoral', otherCountry: '',
        message: '', desiredDate: '', source: '',
      });
      setItems([]);
      setClientProposal({ enabled: false, type: 'percent', value: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  /* -------------------------------------------------------------- */
  /*  Rendu                                                          */
  /* -------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ======================= HERO ======================= */}
      <div className="relative w-full h-[420px] md:h-[500px] bg-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/devis-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Configurez votre projet
          </h1>
          <p className="text-lg md:text-xl text-cyan-200 mb-8">
            Décrivez votre besoin, ajoutez vos articles, ajustez la main d’œuvre —
            obtenez un devis clair en quelques minutes.
          </p>
          <Link
            href="#formulaire"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg"
          >
            Commencer
          </Link>
        </div>
        <div className="absolute bottom-6 right-6 flex gap-4 text-cyan-300/70 text-3xl md:text-4xl">
          <span>⚡</span><span>🛡️</span><span>🏠</span><span>🌐</span>
        </div>
      </div>

      {/* ======================= CORPS ======================= */}
      <form
        id="formulaire"
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto p-6 md:p-8 space-y-8"
      >
        {status === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✓ Votre demande de devis a bien été envoyée ! Nous vous répondrons sous 24h.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ✗ {errorMessage}
          </div>
        )}

        {/* ============ 1. COORDONNÉES + DOMAINE + RÉGION + DESCRIPTION ============ */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <header className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              1
            </span>
            <h2 className="text-2xl font-bold">Votre projet</h2>
          </header>

          {/* Coordonnées */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="lastName" className="block font-semibold mb-2">Nom *</label>
              <input
                type="text" id="lastName" value={formData.lastName}
                onChange={handleChange} required
                className="w-full border p-3 rounded focus:border-blue-600 outline-none"
                placeholder="TCHOFFO"
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block font-semibold mb-2">Prénom *</label>
              <input
                type="text" id="firstName" value={formData.firstName}
                onChange={handleChange} required
                className="w-full border p-3 rounded focus:border-blue-600 outline-none"
                placeholder="Daniel"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="phone" className="block font-semibold mb-2">Téléphone (Cameroun) *</label>
              <input
                type="tel" id="phone" value={formData.phone}
                onChange={handleChange} required
                className="w-full border p-3 rounded focus:border-blue-600 outline-none"
                placeholder="6XXXXXXXX ou +2376XXXXXXXX"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold mb-2">Email (facultatif)</label>
              <input
                type="email" id="email" value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:border-blue-600 outline-none"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Domaine du devis */}
          <p className="block font-semibold mb-3">Domaine du devis *</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {QUOTE_DOMAINS.map((d) => {
              const active = formData.domaine === d.id;
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setFormData((prev) => ({ ...prev, domaine: d.id }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition ${
                    active
                      ? 'border-cyan-500 bg-cyan-50 shadow-md'
                      : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  <span className="text-xs font-medium leading-tight">{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Région / Autres pays */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="region" className="block font-semibold mb-2">
                Région (Cameroun) ou Autres pays *
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded focus:border-blue-600 outline-none"
              >
                {CAMEROON_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="Autres pays">Autres pays</option>
              </select>
            </div>
            {formData.region === 'Autres pays' && (
              <div>
                <label htmlFor="otherCountry" className="block font-semibold mb-2">
                  Nom du pays *
                </label>
                <input
                  type="text" id="otherCountry" value={formData.otherCountry}
                  onChange={handleChange} required
                  className="w-full border p-3 rounded focus:border-blue-600 outline-none"
                  placeholder="Ex: Gabon, Tchad, France..."
                />
              </div>
            )}
          </div>

          {/* Description détaillée (remontée ici) */}
          <div>
            <label htmlFor="message" className="block font-semibold mb-2">
              Description détaillée du projet *
            </label>
            <textarea
              id="message" rows={5} value={formData.message}
              onChange={handleChange} required
              className="w-full border p-3 rounded focus:border-blue-600 outline-none"
              placeholder="Décrivez votre besoin, contraintes techniques, localisation précise, etc."
            />
          </div>
        </section>

        {/* ============ 2. ARTICLES ============ */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <header className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              2
            </span>
            <h2 className="text-2xl font-bold">Articles du projet</h2>
          </header>

          <div className="flex flex-wrap gap-3 mb-5">
            <button
              type="button"
              onClick={importCart}
              disabled={cartItems.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              🛒 Importer mon panier ({cartItems.length})
            </button>
            <span className="text-sm text-gray-500 self-center">
              ou ajoutez un article manuellement ci-dessous
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-2 mb-6">
            <input
              type="text" placeholder="Nom de l'article"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="md:col-span-6 border p-2 rounded"
            />
            <input
              type="number" min="0" step="1" placeholder="Prix (FCFA)"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="md:col-span-3 border p-2 rounded"
            />
            <input
              type="number" min="1" placeholder="Qté"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="md:col-span-1 border p-2 rounded"
            />
            <button
              type="button" onClick={addCustomItem}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm font-semibold"
            >
              + Ajouter
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              Aucun article pour le moment.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Article</th>
                    <th className="py-2 text-center">Prix</th>
                    <th className="py-2 text-center">Qté</th>
                    <th className="py-2 text-right">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-center">{formatFCFA(item.price)}</td>
                      <td className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="mx-2 inline-block w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </td>
                      <td className="py-2 text-right font-semibold">
                        {formatFCFA(item.price * item.quantity)}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <div className="bg-gray-100 rounded-lg px-5 py-3">
              <span className="text-gray-600 mr-3">Sous-total articles :</span>
              <span className="font-bold text-lg">{formatFCFA(subtotal)}</span>
            </div>
          </div>
        </section>

        {/* ============ 3. MAIN D'ŒUVRE (NON MODIFIABLE) ============ */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <header className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              3
            </span>
            <h2 className="text-2xl font-bold">Main d’œuvre</h2>
          </header>

          {/* Proposition WISE BUILD – affichage seul */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-sm text-blue-900 mb-2">
              💡 <strong>Proposition de WISE BUILD</strong>
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                Taux de main d’œuvre appliqué sur le sous-total
              </span>
              <span className="text-2xl font-bold text-blue-700">
                {LABOR_PERCENT}%
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-blue-800">
              <span>Montant de la main d’œuvre</span>
              <span className="font-semibold">{formatFCFA(appLaborAmount)}</span>
            </div>
          </div>

          {/* Proposition du client (facultative) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={clientProposal.enabled}
                onChange={(e) =>
                  setClientProposal({ ...clientProposal, enabled: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="font-semibold text-gray-800">
                Je souhaite faire ma propre proposition de main d’œuvre
              </span>
            </label>

            {clientProposal.enabled && (
              <div className="grid md:grid-cols-3 gap-3 mt-2">
                <select
                  value={clientProposal.type}
                  onChange={(e) =>
                    setClientProposal({
                      ...clientProposal,
                      type: e.target.value as 'percent' | 'fixed',
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="percent">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (FCFA)</option>
                </select>
                <input
                  type="number" min="0" step="1"
                  placeholder={clientProposal.type === 'percent' ? 'Ex: 10' : 'Ex: 50000'}
                  value={clientProposal.value}
                  onChange={(e) =>
                    setClientProposal({ ...clientProposal, value: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <div className="flex items-center text-sm text-gray-600">
                  {clientLaborAmount !== null && (
                    <>Soit {formatFCFA(clientLaborAmount)} de main d’œuvre</>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============ 4. RÉCAPITULATIF ============ */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <header className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              4
            </span>
            <h2 className="text-2xl font-bold">Récapitulatif</h2>
          </header>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Proposition app */}
            <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-5">
              <p className="text-xs uppercase text-blue-700 font-semibold mb-1">
                Proposition WISE BUILD
              </p>
              <p className="text-3xl font-bold text-blue-900 mb-2">
                {formatFCFA(appTotal)}
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Sous-total articles : {formatFCFA(subtotal)}</li>
                <li>
                  Main d’œuvre ({LABOR_PERCENT}%) : {formatFCFA(appLaborAmount)}
                </li>
              </ul>
            </div>

            {/* Proposition client */}
            <div
              className={`border-2 rounded-xl p-5 ${
                clientTotal !== null
                  ? 'border-green-500 bg-green-50'
                  : 'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              <p className="text-xs uppercase font-semibold mb-1 text-gray-700">
                Proposition client
              </p>
              {clientTotal !== null ? (
                <>
                  <p className="text-3xl font-bold text-green-800 mb-2">
                    {formatFCFA(clientTotal)}
                  </p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>Sous-total articles : {formatFCFA(subtotal)}</li>
                    <li>
                      Main d’œuvre (
                      {clientProposal.type === 'percent'
                        ? `${clientProposal.value}%`
                        : 'fixe'}
                      ) : {formatFCFA(clientLaborAmount!)}
                    </li>
                  </ul>
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Activez « Faire ma propre proposition » à l’étape 3 pour voir votre
                  total ici.
                </p>
              )}
            </div>
          </div>

          {/* Date + Source */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="desiredDate" className="block font-semibold mb-2">
                Date souhaitée
              </label>
              <input
                type="date" id="desiredDate" value={formData.desiredDate}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label htmlFor="source" className="block font-semibold mb-2">
                Comment nous avez-vous connu ?
              </label>
              <select
                id="source" value={formData.source} onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="">-- Sélectionner --</option>
                <option value="google">Google / Moteur de recherche</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="recommandation">Recommandation</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition disabled:bg-blue-300"
          >
            {status === 'loading'
              ? 'Envoi en cours...'
              : `Envoyer ma demande de devis — ${formatFCFA(appTotal)}`}
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">
            * Champs obligatoires. Réponse garantie sous 24h ouvrables.
          </p>
        </section>

        <div className="text-center text-gray-600 text-sm">
          📞 Une question ? <strong>697654023</strong> — 📧{' '}
          <strong>dancheffo29@gmail.com</strong>
        </div>
      </form>
    </div>
  );
}