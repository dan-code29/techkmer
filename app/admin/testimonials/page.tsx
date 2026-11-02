'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaStar, FaQuoteLeft, FaCalendarAlt } from 'react-icons/fa';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = () => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer cet avis ?')) {
      try {
        await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        loadTestimonials(); // Recharger la liste après suppression
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gérer les avis clients</h1>
          <p className="text-sm text-gray-500 mt-1">Les avis sont publiés immédiatement sur le site. Supprimez ceux qui sont inappropriés.</p>
        </div>
        <a 
          href="/" 
          target="_blank" 
          className="text-sm font-bold text-[#0066FF] hover:underline bg-blue-50 px-4 py-2 rounded-lg"
        >
          Voir le site ↗
        </a>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          Aucun avis pour le moment.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group flex flex-col justify-between">
              
              {/* Bouton supprimer */}
              <button
                onClick={() => handleDelete(t.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 bg-gray-50 hover:bg-red-50 p-2 rounded-full"
                title="Supprimer cet avis"
              >
                <FaTrash size={14} />
              </button>

              <div>
                {/* Services sélectionnés */}
                {t.services && (
                  <div className="flex flex-wrap gap-1 mb-4 pr-10">
                    {t.services.split(',').map((srv: string) => (
                      <span key={srv} className="bg-[#0066FF]/10 text-[#0066FF] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {srv.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message */}
                <FaQuoteLeft className="text-[#00C2FF]/20 mb-3" size={20} />
                <p className="text-sm text-gray-700 italic mb-4">« {t.text} »</p>
                
                {/* Étoiles */}
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>
              </div>

              {/* Infos Auteur + Date */}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                {t.created_at && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <FaCalendarAlt size={10} />
                    {formatDate(t.created_at)}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}