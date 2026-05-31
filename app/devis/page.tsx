'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DevisPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: 'installation',
    place: 'Yaounde',
    placeOther: '',
    contactMethod: 'phone',
    desiredSchedule: 'asap',
    otherSchedule: '',
    existingEquipment: false,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    const { id, value, type, checked } = target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', serviceType: 'installation', place: 'Yaounde', placeOther: '', contactMethod: 'phone', desiredSchedule: 'asap', otherSchedule: '', existingEquipment: false, message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner – conforme à la description */}
      <div className="relative w-full h-[500px] md:h-[550px] bg-blue-900 overflow-hidden">
        {/* Image de fond (remplacer par votre bannière générée) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/devis-banner.jpg')" }}
        />
        {/* Dégradé pour lisibilité du texte (sur la gauche) */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-900/40 to-transparent" />
        
        {/* Contenu textuel – aligné à gauche */}
        <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Demandez votre devis gratuit
          </h1>
          <p className="text-lg md:text-xl text-cyan-200 mb-8">
            Des solutions sur mesure pour vos projets d’électricité, réseau, domotique et sécurité électronique.
          </p>
          <Link
            href="#formulaire"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg"
          >
            Commencer mon devis
          </Link>
        </div>

        {/* Icônes technologiques flottantes (côté droit) */}
        <div className="absolute bottom-6 right-6 flex gap-4 text-cyan-300/70 text-3xl md:text-4xl">
          <span title="Électricité">⚡</span>
          <span title="Réseau">🌐</span>
          <span title="Domotique">🏠</span>
          <span title="Sécurité">🛡️</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* 3 piliers (avantages) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-bold text-lg mb-1">Réponse rapide</h3>
            <p className="text-gray-600 text-sm">Recontact sous 24h</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-bold text-lg mb-1">Devis sans engagement</h3>
            <p className="text-gray-600 text-sm">Évaluation gratuite</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-2">💼</div>
            <h3 className="font-bold text-lg mb-1">Expertise garantie</h3>
            <p className="text-gray-600 text-sm">Conseils d'experts</p>
          </div>
        </div>

        {/* Formulaire */}
        <div id="formulaire" className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          {status === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              ✓ Votre demande a bien été envoyée ! Nous vous répondrons sous 24h.
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              ✗ Erreur : {errorMessage}
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">Remplissez vos informations</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block font-semibold mb-2">Nom *</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-3 rounded focus:border-blue-600" placeholder="N'Diaye" />
              </div>
              <div>
                <label htmlFor="firstName" className="block font-semibold mb-2">Prénom *</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-3 rounded focus:border-blue-600" placeholder="Jean" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block font-semibold mb-2">Entreprise</label>
                <input type="text" id="company" value={formData.company} onChange={handleChange} className="w-full border p-3 rounded" />
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold mb-2">Email (facultatif)</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded" placeholder="votre@email.com" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block font-semibold mb-2">Téléphone *</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required pattern="^(\\+237)?6[0-9]{7}$" className="w-full border p-3 rounded" placeholder="+2376XXXXXXXX" />
                <p className="text-xs text-gray-500 mt-1">Format camerounais attendu : +2376XXXXXXXX ou 6XXXXXXXX</p>
              </div>
              <div>
                <label htmlFor="serviceType" className="block font-semibold mb-2">Type de service *</label>
                <select id="serviceType" value={formData.serviceType} onChange={handleChange} required className="w-full border p-3 rounded">
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-4">
              <div>
                <label htmlFor="place" className="block font-semibold mb-2">Lieu (Cameroun) *</label>
                <select id="place" value={formData.place} onChange={handleChange} required className="w-full border p-3 rounded">
                  <option value="Yaounde">Yaoundé</option>
                  <option value="Douala">Douala</option>
                  <option value="Bafoussam">Bafoussam</option>
                  <option value="Garoua">Garoua</option>
                  <option value="Maroua">Maroua</option>
                  <option value="Bertoua">Bertoua</option>
                  <option value="Ngaoundere">Ngaoundéré</option>
                  <option value="autre">Autre</option>
                </select>
                {formData.place === 'autre' && (
                  <input type="text" id="placeOther" value={formData.placeOther} onChange={handleChange} className="mt-2 w-full border p-3 rounded" placeholder="Indiquez la ville" />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactMethod" className="block font-semibold mb-2">Moyen de contact préféré</label>
                <select id="contactMethod" value={formData.contactMethod} onChange={handleChange} className="w-full border p-3 rounded">
                  <option value="phone">Téléphone</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label htmlFor="desiredSchedule" className="block font-semibold mb-2">Délai souhaité</label>
                <select id="desiredSchedule" value={formData.desiredSchedule} onChange={handleChange} className="w-full border p-3 rounded">
                  <option value="asap">Dès que possible</option>
                  <option value="1week">Sous 1 semaine</option>
                  <option value="1month">Sous 1 mois</option>
                  <option value="flexible">Flexible</option>
                  <option value="autre">Autre (saisir)</option>
                </select>
                {formData.desiredSchedule === 'autre' && (
                  <input type="text" id="otherSchedule" value={formData.otherSchedule} onChange={handleChange} placeholder="Précisez le délai souhaité" className="mt-2 w-full border p-3 rounded" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="existingEquipment" checked={formData.existingEquipment} onChange={handleChange} className="h-4 w-4" />
              <label htmlFor="existingEquipment" className="text-gray-700">Le site dispose déjà d'équipements</label>
            </div>

            <div>
              <label htmlFor="message" className="block font-semibold mb-2">Détails et précisions *</label>
              <textarea id="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full border p-3 rounded" placeholder="Décrivez votre projet, contraintes, accès, et toute information utile"></textarea>
            </div>

            <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition disabled:bg-blue-300">
              {status === 'loading' ? 'Envoi en cours...' : 'Demander un devis'}
            </button>
            <p className="text-sm text-gray-500 text-center">* Champs obligatoires</p>
          </form>
        </div>

        {/* Pied de page information */}
        <div className="mt-12 pt-8 border-t text-center text-gray-600">
          <p>📞 Une question ? Contactez-nous au <strong>697654023</strong> ou par email à <strong>dancheffo29@gmail.com</strong></p>
          <p className="text-sm mt-2">Réponse garantie sous 24h ouvrables.</p>
        </div>
      </div>
    </div>
  );
}