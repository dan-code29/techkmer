'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

export default function AdminProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les projets
  const loadProjects = () => {
    setLoading(true);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Fonction pour supprimer un projet
  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ? Cette action est irréversible.')) {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Réalisation supprimée !');
          loadProjects(); // Recharger la liste
        }
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gérer les réalisations</h1>
          <p className="text-gray-500 text-sm mt-1">Ajoutez, modifiez ou supprimez vos projets.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="bg-[#0066FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition shadow-md"
        >
          <FaPlus /> Nouvelle réalisation
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucune réalisation pour le moment.</p>
          <Link href="/admin/projects/new" className="text-[#0066FF] font-bold mt-2 inline-block hover:underline">
            Ajouter ma première réalisation
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-semibold">Projet</th>
                  <th className="p-4 font-semibold">Catégorie</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 bg-gray-100">
                          {p.images && p.images[0] ? (
                            <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-xs text-gray-400">N/A</span>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 capitalize">{p.category}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'en_cours' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.status === 'en_cours' ? '🚧 En cours' : '✅ Terminé'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{p.year}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/realisations/${p.id}`} 
                          target="_blank"
                          className="text-gray-400 hover:text-[#0066FF] transition"
                          title="Voir sur le site"
                        >
                          <FaEye size={16} />
                        </Link>
                        <Link 
                          href={`/admin/projects/${p.id}/edit`} 
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Modifier"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="text-red-500 hover:text-red-700 transition"
                          title="Supprimer"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}