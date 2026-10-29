'use client';

/* ================================================================== */
/*  COMPONENTS/PROJECTCAROUSEL.TSX                                     */
/*  ------------------------------------------------------------------ */
/*  Carrousel d'images réutilisable.                                   */
/*  Utilisé dans la page détail d'une réalisation (/realisations/[id]) */
/*                                                                     */
/*  Fonctionnalités :                                                  */
/*  - Flèches gauche/droite                                            */
/*  - Dots de navigation en bas                                        */
/*  - Défilement automatique (toutes les 4s)                           */
/*  - Pause au survol (pour laisser le temps de regarder)              */
/* ================================================================== */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';

type Props = {
  images: string[];
  alt: string;
};

export default function ProjectCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  /* --- Navigation --- */
  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  /* --- Auto-play --- */
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [autoplay, next]);

  /* --- Navigation clavier --- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-2xl bg-gray-100"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Image */}
      <Image
        src={images[index]}
        alt={`${alt} — photo ${index + 1}`}
        fill
        priority
        className="object-cover transition-opacity duration-500"
      />

      {/* Overlay sombre pour la lisibilité des boutons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Flèche précédente */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        aria-label="Image précédente"
      >
        <FaChevronLeft size={14} />
      </button>

      {/* Flèche suivante */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        aria-label="Image suivante"
      >
        <FaChevronRight size={14} />
      </button>

      {/* Compteur + bouton pause */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={() => setAutoplay((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white"
          aria-label={autoplay ? 'Mettre en pause' : 'Lancer le diaporama'}
        >
          {autoplay ? <FaPause size={10} /> : <FaPlay size={10} />}
        </button>
      </div>

      {/* Dots de navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Aller à l'image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}