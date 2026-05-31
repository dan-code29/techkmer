'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DevisPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    serviceType: 'installation',
    lieu: 'Douala',
    budget: '',
    message: '',
    desiredDate: '',
    source: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validation basique du numéro Cameroun (+237 6XX XX XX XX ou 6XX XX XX XX)
  const isValidCameroonPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    const regex = /^(?:\+237|237)?[6-9][0-9]{8}$/;
    return regex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validation téléphone (obligatoire)
    if (!formData.phone || !isValidCameroonPhone(formData.phone)) {
      setStatus('error');
      setErrorMessage('Veuillez entrer un numéro de téléphone camerounais valide (ex: 6XXXXXXXX ou +2376XXXXXXXX).');
      return;
    }

    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
      setStatus('success');
      setFormData({
        lastName: '', firstName: '', email: '', phone: '', serviceType: 'installation',
        lieu: 'Douala', budget: '', message: '', desiredDate: '', source: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner (identique à avant) – gardez votre bannière existante */}
      <div className="relative w-full h-[500px] md:h-[550px] bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/devis-banner.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-900/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Demandez votre devis gratuit</h1>
          <p className="text-lg md:text-xl text-cyan-200 mb-8">Des solutions sur mesure pour vos projets d’électricité, réseau, domotique et sécurité électronique.</p>
          <Link href="#formulaire" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg">Commencer mon devis</Link>
        </div>
        <div className="absolute bottom-6 right-6 flex gap-4 text-cyan-300/70 text-3xl md:text-4xl">
          <span title="Électricité">⚡</span><span title="Réseau">🌐</span><span title="Domotique">🏠</span><span title="Sécurité">🛡️</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* 3 avantages (rapide, sans engagement, expertise) – à garder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center"><div className="text-4xl mb-2">⚡</div><h3 className="font-bold text-lg mb-1">Réponse rapide</h3><p className="text-gray-600 text-sm">Sous 24h</p></div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center"><div className="text-4xl mb-2">🎯</div><h3 className="font-bold text-lg mb-1">Devis sans engagement</h3><p className="text-gray-600 text-sm">Évaluation gratuite</p></div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center"><div className="text-4xl mb-2">💼</div><h3 className="font-bold text-lg mb-1">Expertise garantie</h3><p className="text-gray-600 text-sm">Conseils d'experts</p></div>
        </div>

        {/* Formulaire */}
        <div id="formulaire" className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          {status === 'success' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">✓ Votre demande a bien été envoyée ! Nous vous répondrons sous 24h.</div>}
          {status === 'error' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">✗ Erreur : {errorMessage}</div>}

          <h2 className="text-2xl font-bold mb-6">Remplissez vos informations</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block font-semibold mb-2">Nom *</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-3 rounded focus:border-blue-600" placeholder="TCHOFFO" />
              </div>
              <div>
                <label htmlFor="firstName" className="block font-semibold mb-2">Prénom *</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-3 rounded focus:border-blue-600" placeholder="Daniel" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block font-semibold mb-2">Téléphone (Cameroun) *</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-3 rounded" placeholder="6XXXXXXXX ou +2376XXXXXXXX" />
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold mb-2">Email (facultatif)</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded" placeholder="votre@email.com" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="serviceType" className="block font-semibold mb-2">Type de service *</label>
                <select id="serviceType" value={formData.serviceType} onChange={handleChange} required className="w-full border p-3 rounded">
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="depannage">Dépannage</option>
                  <option value="conseil">Conseil</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="lieu" className="block font-semibold mb-2">Ville / Lieu (Cameroun) *</label>
                <select id="lieu" value={formData.lieu} onChange={handleChange} required className="w-full border p-3 rounded">
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Garoua">Garoua</option>
                  <option value="Bafoussam">Bafoussam</option>
                  <option value="Bamenda">Bamenda</option>
                  <option value="Bertoua">Bertoua</option>
                  <option value="Ngaoundéré">Ngaoundéré</option>
                  <option value="Autre">Autre (précisez dans la description)</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget" className="block font-semibold mb-2">Budget approximatif (FCFA)</label>
                <select id="budget" value={formData.budget} onChange={handleChange} className="w-full border p-3 rounded">
                  <option value="">Sélectionner</option>
                  <option value="moins-100k">&lt; 100 000 FCFA</option>
                  <option value="100k-500k">100 000 - 500 000 FCFA</option>
                  <option value="500k-1m">500 000 - 1 000 000 FCFA</option>
                  <option value="plus-1m">&gt; 1 000 000 FCFA</option>
                </select>
              </div>
              <div>
                <label htmlFor="desiredDate" className="block font-semibold mb-2">Date souhaitée</label>
                <input type="date" id="desiredDate" value={formData.desiredDate} onChange={handleChange} className="w-full border p-3 rounded" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block font-semibold mb-2">Description détaillée du projet *</label>
              <textarea id="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full border p-3 rounded" placeholder="Décrivez votre besoin, contraintes techniques, localisation précise, etc."></textarea>
            </div>
            <div>
              <label htmlFor="source" className="block font-semibold mb-2">Comment nous avez-vous connu ?</label>
              <select id="source" value={formData.source} onChange={handleChange} className="w-full border p-3 rounded">
                <option value="">-- Sélectionnez --</option>
                <option value="google">Google / Moteur de recherche</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="recommandation">Recommandation</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition disabled:bg-blue-300">
              {status === 'loading' ? 'Envoi en cours...' : 'Demander un devis'}
            </button>
            <p className="text-sm text-gray-500 text-center">* Champs obligatoires</p>
          </form>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-gray-600">
          <p>📞 Une question ? Contactez-nous au <strong>697654023</strong> ou par email à <strong>dancheffo29@gmail.com</strong></p>
          <p className="text-sm mt-2">Réponse garantie sous 24h ouvrables.</p>
        </div>
      </div>
    </div>
  );
}