'use client';

import { useState } from 'react';
import { FaStar, FaTimes, FaCheck } from 'react-icons/fa';

// Liste des services proposés par CHEFFBUILD
const AVAILABLE_SERVICES = [
  'Électricité', 'Solaire', 'Réseau & IT', 'Sécurité', 
  'Domotique', 'Automatisation', 'Maintenance', 'Achat produit'
];

export default function TestimonialForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ 
    name: '', 
    role: '', 
    text: '', 
    rating: 5,
    services: [] as string[] // 👈 Tableau pour stocker les choix
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const MAX_CHARS = 500; // 👈 Limite de caractères

  // Fonction pour ajouter/retirer un service
  const handleServiceToggle = (service: string) => {
    setForm(prev => {
      const isSelected = prev.services.includes(service);
      return {
        ...prev,
        services: isSelected 
          ? prev.services.filter(s => s !== service) // On retire
          : [...prev.services, service]               // On ajoute
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { onClose(); window.location.reload(); }, 3000);
      } else {
        alert("Erreur lors de l'envoi");
      }
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🙏</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre avis !</h3>
        <p className="text-gray-600 text-sm">Il est maintenant visible sur le site.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-gray-900">Laissez votre avis</h3>
        <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition"><FaTimes size={14} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Votre nom *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm focus:border-[#0066FF] outline-none" placeholder="Ex: M. Dupont" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Ville / Profession *</label>
            <input type="text" required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm focus:border-[#0066FF] outline-none" placeholder="Ex: Yaoundé" />
          </div>
        </div>

        {/* 👇 ZONE DE SÉLECTION DES SERVICES 👇 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Services concernés (optionnel)</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SERVICES.map((service) => {
              const isSelected = form.services.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    isSelected 
                      ? 'bg-[#0066FF] border-[#0066FF] text-white' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#0066FF]'
                  }`}
                >
                  {isSelected && <FaCheck size={10} />} {service}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Note (sur 5) *</label>
          <div className="flex gap-1 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setForm({...form, rating: star})} className={`${form.rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition`}>
                <FaStar />
              </button>
            ))}
          </div>
        </div>

        {/* 👇 ZONE DE MESSAGE AVEC LIMITE DE CARACTÈRES 👇 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Votre message *</label>
            <span className={`text-[10px] font-semibold ${form.text.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
              {form.text.length} / {MAX_CHARS} caractères
            </span>
          </div>
          <textarea 
            required 
            rows={4} 
            maxLength={MAX_CHARS} // 👈 Bloque la saisie au-delà de 500
            value={form.text} 
            onChange={e => setForm({...form, text: e.target.value})} 
            className="w-full border rounded-lg p-2.5 text-sm focus:border-[#0066FF] outline-none resize-none" 
            placeholder="Décrivez votre expérience en quelques lignes..."
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#0066FF] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'Envoi en cours...' : 'Publier mon avis'}
        </button>
      </form>
    </div>
  );
}