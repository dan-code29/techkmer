'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import TestimonialForm from './TestimonialForm';

export default function TestimonialSection({ testimonials }: { testimonials: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // 👈 LA VARIABLE MANQUANTE EST ICI
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoPlay, setAutoPlay] = useState(true);

  // 👇 INITIALISATION DU PORTER
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LOGIQUE DU CARROUSEL ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // --- AUTO-PLAY ---
  useEffect(() => {
    if (!autoPlay || !scrollRef.current) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  // --- FORMATAGE DE LA DATE ---
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <section className="relative z-10 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* EN-TÊTE DE SECTION */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
            Témoignages
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Ils nous font <span className="animate-gradient bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Ce que nos clients disent de nous après leur projet.
          </p>
        </div>

        {/* CONTENEUR DU CARROUSEL */}
        <div 
          className="relative group/carousel"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {/* Flèche Gauche */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-lg border border-gray-100 transition hover:bg-[#0066FF] hover:text-white md:-left-4 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Avis précédent"
          >
            <FaChevronLeft size={14} />
          </button>

          {/* Flèche Droite */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-lg border border-gray-100 transition hover:bg-[#0066FF] hover:text-white md:-right-4 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Avis suivant"
          >
            <FaChevronRight size={14} />
          </button>

          {/* Piste défilante */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t: any, index: number) => (
              <div 
                key={t.id || index} 
                className="w-[320px] md:w-[380px] shrink-0 snap-start rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* 1. SERVICES SÉLECTIONNÉS */}
                  {t.services && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.services.split(',').map((srv: string) => (
                        <span key={srv} className="bg-[#0066FF]/10 text-[#0066FF] text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          {srv.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 2. LE MESSAGE */}
                  <FaQuoteLeft className="mb-3 text-[#00C2FF]/30" size={20} />
                  <p className="mb-5 text-sm leading-relaxed text-gray-700 italic line-clamp-4 min-h-[80px]">
                    « {t.text} »
                  </p>
                </div>

                <div>
                  {/* 3. LES ÉTOILES */}
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  {/* 4. AUTEUR + DATE */}
                  <div className="mt-3 border-t border-gray-200 pt-3 flex justify-between items-end">
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                    
                    {t.created_at && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <FaCalendarAlt size={10} />
                        {formatDate(t.created_at)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOUTON POUR LAISSER UN AVIS */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Vous avez travaillé avec nous ?</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0066FF] bg-white px-8 py-3 font-bold text-[#0066FF] hover:bg-[#0066FF] hover:text-white transition shadow-md"
          >
            ⭐ Laisser un avis
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL D'AVIS (Corrigée)                                      */}
      {/* ============================================================ */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 md:p-6">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-8">
              <TestimonialForm onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}