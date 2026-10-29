'use client';

/* ================================================================== */
/*  COMPONENTS/HOMEREALISATIONS.TSX                                    */
/*  ------------------------------------------------------------------ */
/*  Section "Nos réalisations" pour la page d'accueil.                 */
/*  - 7 cards (1 par catégorie)                                        */
/*  - Rotation indépendante (délais décalés)                           */
/*  - Fix Hydration : état initial déterministe (pas de Math.random)   */
/* ================================================================== */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog, FaTools,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt,
} from 'react-icons/fa';

import {
  PROJECTS, // ← On importe PROJECTS pour l'état initial
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  CATEGORY_ORDER,
  pickProjectForCategory,
  pickAllCategories,
  type Project,
  type ProjectCategory,
} from '@/lib/projects';

const CATEGORY_ICONS: Record<ProjectCategory, React.ComponentType<{ size?: number }>> = {
  securite: FaShieldAlt,
  solaire: FaSun,
  reseau: FaNetworkWired,
  domotique: FaHome,
  electricite: FaBolt,
  automatisation: FaCog,
  maintenance: FaTools,
};

export default function HomeRealisations() {
  /* ---------- ÉTAT INITIAL DÉTERMINISTE (Fix Hydration) ---------- */
  const [displayed, setDisplayed] = useState<Record<ProjectCategory, Project | null>>(() => {
    const initial = {} as Record<ProjectCategory, Project | null>;
    // On prend le PREMIER projet de chaque catégorie pour le rendu serveur
    CATEGORY_ORDER.forEach((cat) => {
      initial[cat] = PROJECTS.find((p) => p.category === cat) || null;
    });
    return initial;
  });

  /* ---------- ROTATION (uniquement côté client) ---------- */
  useEffect(() => {
    // 1. Dès le montage client, on randomise
    setDisplayed(pickAllCategories());

    // 2. Puis on lance les intervalles décalés
    const intervals = CATEGORY_ORDER.map((cat, i) =>
      setInterval(
        () => {
          setDisplayed((prev) => ({
            ...prev,
            [cat]: pickProjectForCategory(cat, prev[cat]?.id),
          }));
        },
        5000 + i * 800
      )
    );

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
            Portfolio
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Nos{' '}
            <span className="animate-gradient bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#0066FF] bg-clip-text text-transparent">
              réalisations
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Un aperçu de nos projets par domaine. Cliquez sur une carte pour découvrir les détails.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const project = displayed[cat];
            if (!project) return null;

            const Icon = CATEGORY_ICONS[cat];
            const styles = CATEGORY_STYLES[cat];

            return (
              <Link
                key={cat}
                href={`/realisations/${project.id}`}
                className={`group overflow-hidden rounded-2xl border-2 bg-white/70 text-left shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl ${styles.border}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    key={project.id}
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${styles.badge}`}>
                    <Icon size={10} />
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="line-clamp-2 text-sm font-bold leading-tight">
                      {project.title}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt size={10} /> {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={10} /> {project.year}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Voir tous les projets
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}