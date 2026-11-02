'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Impossible de charger les données. Avez-vous créé la table dans Turso ?");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Chiffres mis à jour avec succès !');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, field: 'value' | 'label', newValue: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, [field]: newValue } : s));
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  if (errorMsg) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200">
          <h2 className="font-bold mb-2">Erreur</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chiffres clés du site</h1>
          <p className="text-sm text-gray-500">Ces valeurs s'affichent sur la page d'accueil et la page À propos.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#0066FF] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold transition shadow-md disabled:opacity-50"
        >
          <FaSave /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Chiffre</th>
              <th className="p-4 font-semibold text-gray-600">Texte descriptif</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.key} className="border-b border-gray-100">
                <td className="p-4 w-1/3">
                  <input 
                    type="text" 
                    value={s.value} 
                    onChange={(e) => handleChange(s.key, 'value', e.target.value)}
                    className="w-full border p-2 rounded font-bold text-xl text-[#0066FF] focus:outline-none focus:border-[#0066FF]"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={s.label} 
                    onChange={(e) => handleChange(s.key, 'label', e.target.value)}
                    className="w-full border p-2 rounded text-gray-700 focus:outline-none focus:border-[#0066FF]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}