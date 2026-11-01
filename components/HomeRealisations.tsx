'use client';

/* ================================================================== */
/*  COMPONENTS/HOMEREALISATIONS.TSX                                    */
/*  ------------------------------------------------------------------ */
/*  Section "Nos réalisations" pour la page d'accueil.                 */
/*  - 7 cards (1 par catégorie)                                        */
/*  - Rotation indépendante (délais décalés)                           */
/*  - NOUVEAU : Récupère les données dynamiquement depuis /api/projects*/
/* ================================================================== */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog, FaTools,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt,
} from 'react-icons/fa';

import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  CATEGORY_ORDER,
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
  // On stocke tous les projets récupérés depuis l'API
  const [projects, setProjects] = useState<Project[]>([]);
  
  // On stocke le projet actuellement affiché pour chaque catégorie
  const [displayed, setDisplayed] = useState<Record<ProjectCategory, Project | null>>(
    {} as Record<ProjectCategory, Project | null>
  );
  
  // État de chargement
  const [loading, setLoading] = useState(true);

  /* ---------- 1. CHARGEMENT DES DONNÉES DEPUIS L'API ---------- */
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);

        // Initialiser l'affichage avec le premier projet trouvé pour chaque catégorie
        const initialDisplayed = {} as Record<ProjectCategory, Project | null>;
        CATEGORY_ORDER.forEach((cat) => {
          initialDisplayed[cat] = data.find((p) => p.category === cat) || null;
        });
        setDisplayed(initialDisplayed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des projets:", err);
        setLoading(false);
      });
  }, []);

  /* ---------- 2. ROTATION ALÉATOIRE ---------- */
  useEffect(() => {
    // On ne lance la rotation que si on a des projets
    if (projects.length === 0) return;

    const intervals = CATEGORY_ORDER.map((cat, i) =>
      setInterval(
        () => {
          setDisplayed((prev) => {
            // On cherche tous les projets de cette catégorie, sauf celui affiché actuellement
            const pool = projects.filter(
              (p) => p.category === cat && p.id !== prev[cat]?.id
            );

            // S'il n'y a pas d'autre projet dans cette catégorie, on ne change rien
            if (pool.length === 0) return prev;

            // On tire un projet au hasard
            const randomProject = pool[Math.floor(Math.random() * pool.length)];
            
            return {
              ...prev,
              [cat]: randomProject,
            };
          });
        },
        5000 + i * 800 // Délais décalés pour un effet organique
      )
    );

    return () => intervals.forEach(clearInterval);
  }, [projects]);

  /* ---------- 3. AFFICHAGE DU CHARGEMENT ---------- */
  if (loading) {
    return (
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Chargement des réalisations...</p>
        </div>
      </section>
    );
  }

  /* ---------- 4. RENDU PRINCIPAL ---------- */
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        {/* --- EN-TÊTE --- */}
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

        {/* --- GRILLE DES 7 CATÉGORIES --- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const project = displayed[cat];
            
            // Si aucune réalisation n'existe pour cette catégorie, on n'affiche rien
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
                    src={project.images[0] || '/images/placeholder.jpg'}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Badge Catégorie */}
                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${styles.badge}`}>
                    <Icon size={10} />
                    {CATEGORY_LABELS[cat]}
                  </span>
                  
                  {/* Titre */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="line-clamp-2 text-sm font-bold leading-tight">
                      {project.title}
                    </p>
                  </div>
                </div>
                
                {/* Infos (Lieu & Date) */}
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

        {/* --- BOUTON VOIR TOUT --- */}
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