'use client';

/* ================================================================== */
/*  IMPORTS                                                            */
/* ================================================================== */
import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog, FaTools,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaExternalLinkAlt,
} from 'react-icons/fa';

/* --- Données centralisées (lib/projects.ts) --- */
import {
  PROJECTS,
  CATEGORY_STYLES,
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from '@/lib/projects';

/* ================================================================== */
/*  CATÉGORIES (utilisées uniquement pour les boutons filtres)         */
/*  Les données elles-mêmes viennent de lib/projects.ts                */
/* ================================================================== */
const CATEGORIES = [
  { id: 'all', label: 'Tous les projets', icon: null },
  { id: 'securite', label: CATEGORY_LABELS.securite, icon: FaShieldAlt },
  { id: 'solaire', label: CATEGORY_LABELS.solaire, icon: FaSun },
  { id: 'reseau', label: CATEGORY_LABELS.reseau, icon: FaNetworkWired },
  { id: 'domotique', label: CATEGORY_LABELS.domotique, icon: FaHome },
  { id: 'electricite', label: CATEGORY_LABELS.electricite, icon: FaBolt },
  { id: 'automatisation', label: CATEGORY_LABELS.automatisation, icon: FaCog },
  { id: 'maintenance', label: CATEGORY_LABELS.maintenance, icon: FaTools },
];

/* ================================================================== */
/*  COMPOSANT PRINCIPAL                                                */
/* ================================================================== */
export default function Realisations() {
  /* ---------- ÉTATS ---------- */
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  /* ---------- FILTRAGE + TRI PAR DATE ---------- */
  const filtered = useMemo(() => {
    const list =
      activeCategory === 'all'
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeCategory);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeCategory]);

  /* ---------- OUVERTURE MODAL ---------- */
  const openProject = (p: Project) => {
    setSelectedProject(p);
    setCurrentImageIndex(0);
    setAutoPlay(true);
  };

  /* ---------- NAVIGATION IMAGES ---------- */
  const nextImage = useCallback(() => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  }, [selectedProject]);

  const prevImage = useCallback(() => {
    if (!selectedProject) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
    );
  }, [selectedProject]);

  /* ---------- AUTO-PLAY ---------- */
  useEffect(() => {
    if (!selectedProject || !autoPlay) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedProject, autoPlay]);

  /* ---------- CLAVIER ---------- */
  useEffect(() => {
    if (!selectedProject) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProject, nextImage, prevImage]);

  /* ---------- BLOCAGE SCROLL ---------- */
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  /* ================================================================ */
  /*  RENDU                                                           */
  /* ================================================================ */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">

      {/* ============ FOND DYNAMIQUE ============ */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 right-1/4 h-[450px] w-[450px] rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ============ HERO ============ */}
      <section className="relative z-10 overflow-hidden bg-[#050B16] text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/projects/hero.jpg"
            alt="Réalisations CHEFFBUILD"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/90 to-[#050B16]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_45%)] opacity-20" />
        </div>

        <div className="relative container mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-28">
          <span className="mb-6 inline-block rounded-full border border-[#00C2FF]/40 bg-[#0066FF]/20 px-4 py-1.5 text-xs font-bold tracking-widest text-[#00C2FF]">
            PORTFOLIO
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Nos <span className="text-[#00C2FF]">réalisations</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Découvrez quelques projets que nous avons menés à travers le Cameroun —
            sécurité, solaire, réseau, domotique, électricité, automatisation et maintenance.
          </p>

          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-bold text-[#00C2FF] md:text-4xl">150+</p>
              <p className="text-sm text-gray-400">Projets livrés</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#00C2FF] md:text-4xl">10</p>
              <p className="text-sm text-gray-400">Régions couvertes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#00C2FF] md:text-4xl">100%</p>
              <p className="text-sm text-gray-400">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTRES ============ */}
      <section className="sticky top-0 z-30 border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-md">
        <div className="container mx-auto overflow-x-auto px-4 py-4">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              const styles =
                cat.id !== 'all' ? CATEGORY_STYLES[cat.id as ProjectCategory] : null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? styles
                        ? styles.filterActive
                        : 'border-[#0066FF] bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                      : 'border-white/70 bg-white/70 text-gray-700 backdrop-blur-md hover:border-[#00C2FF] hover:text-[#0066FF]'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ GRILLE ============ */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/70 bg-white/70 py-20 text-center text-gray-500 backdrop-blur-md">
              Aucun projet dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const catInfo = CATEGORIES.find((c) => c.id === p.category);
                const Icon = catInfo?.icon || null;
                const styles = CATEGORY_STYLES[p.category];
                const cover = p.images[0];

                return (
                  <button
                    key={p.id}
                    onClick={() => openProject(p)}
                    className={`group overflow-hidden rounded-2xl border-2 bg-white/70 text-left shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl ${styles.border}`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${styles.badge}`}>
                        {Icon && <Icon size={10} />}
                        {catInfo?.label}
                      </span>
                      <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {p.year}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        📷 {p.images.length}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="line-clamp-2 text-base font-bold leading-tight">{p.title}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} /> {p.location}</span>
                        <span className="flex items-center gap-1"><FaCalendarAlt size={10} /> {p.year}</span>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{p.shortDesc}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0066FF] transition-all group-hover:gap-2">
                        Voir le détail <FaArrowRight size={10} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] p-10 text-center text-white shadow-xl shadow-[#0066FF]/20 md:p-14">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Votre projet mérite la même exigence.
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Parlons de votre besoin. Devis gratuit sous 24h.
            </p>
            <Link
              href="/devis"
              className="inline-block rounded-lg bg-white px-10 py-4 font-bold text-[#0066FF] shadow-xl transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MODAL DÉTAIL + GALERIE ============ */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Carrousel */}
            <div
              className="group/carousel relative h-72 md:h-96"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <Image
                src={selectedProject.images[currentImageIndex]}
                alt={`${selectedProject.title} — photo ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white"
                aria-label="Fermer"
              >
                <FaTimes />
              </button>

              <div className="absolute left-4 top-4 z-20">
                {(() => {
                  const catInfo = CATEGORIES.find((c) => c.id === selectedProject.category);
                  const Icon = catInfo?.icon;
                  const styles = CATEGORY_STYLES[selectedProject.category];
                  return (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-md ${styles.badge}`}>
                      {Icon && <Icon size={12} />}
                      {catInfo?.label}
                    </span>
                  );
                })()}
              </div>

              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
                aria-label="Image précédente"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
                aria-label="Image suivante"
              >
                <FaChevronRight size={14} />
              </button>

              <div className="absolute bottom-20 right-4 z-20 flex items-center gap-2">
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {currentImageIndex + 1} / {selectedProject.images.length}
                </span>
                <button
                  onClick={() => setAutoPlay((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white"
                  aria-label={autoPlay ? 'Pause' : 'Lecture'}
                >
                  {autoPlay ? <FaPause size={10} /> : <FaPlay size={10} />}
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
                <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                  {selectedProject.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-200">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt size={12} /> {selectedProject.location}</span>
                  <span className="flex items-center gap-1.5"><FaCalendarAlt size={12} /> {selectedProject.year}</span>
                  <span className="flex items-center gap-1.5">👤 {selectedProject.client}</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                {selectedProject.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-6 bg-[#00C2FF]' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Contenu détail */}
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0066FF]">Aperçu</h3>
                <p className="leading-relaxed text-gray-700">{selectedProject.shortDesc}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">🎯 Défi</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{selectedProject.challenge}</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">💡 Solution</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{selectedProject.solution}</p>
                </div>
              </div>

              <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">✅ Résultat</h4>
                <p className="text-sm leading-relaxed text-gray-700">{selectedProject.result}</p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0066FF]">Points clés du projet</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {selectedProject.features.map((f) => (
                    <div key={f} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                      <FaCheckCircle className="mx-auto mb-1 text-[#00C2FF]" size={14} />
                      <p className="text-xs font-semibold leading-tight text-gray-700">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============ OPTION D : 2 boutons ============ */}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                <Link
                  href={`/realisations/${selectedProject.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-6 py-3 font-bold text-white transition hover:bg-[#0052cc]"
                >
                  <FaExternalLinkAlt size={11} />
                  Voir la fiche complète
                </Link>
                <Link
                  href="/devis"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:border-[#0066FF]/40 hover:bg-gray-50"
                >
                  Demander un devis <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}