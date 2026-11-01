'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog, FaTools,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaExternalLinkAlt,
} from 'react-icons/fa';
import {
  CATEGORY_STYLES,
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from '@/lib/projects';

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

export default function Realisations() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const list =
      activeCategory === 'all'
        ? projects
        : projects.filter((p) => p.category === activeCategory);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeCategory, projects]);

  const openProject = (p: Project) => {
    setSelectedProject(p);
    setCurrentImageIndex(0);
    setAutoPlay(true);
  };

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

  useEffect(() => {
    if (!selectedProject || !autoPlay) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedProject, autoPlay]);

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

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">
      
      {/* Hero */}
      <section className="relative z-10 overflow-hidden bg-[#050B16] text-white">
        <div className="relative container mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-28">
          <span className="mb-6 inline-block rounded-full border border-[#00C2FF]/40 bg-[#0066FF]/20 px-4 py-1.5 text-xs font-bold tracking-widest text-[#00C2FF]">
            PORTFOLIO
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Nos <span className="text-[#00C2FF]">réalisations</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Découvrez quelques projets que nous avons menés à travers le Cameroun.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="sticky top-0 z-30 border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-md">
        <div className="container mx-auto overflow-x-auto px-4 py-4">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              const styles = cat.id !== 'all' ? CATEGORY_STYLES[cat.id as ProjectCategory] : null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? styles ? styles.filterActive : 'border-[#0066FF] bg-[#0066FF] text-white'
                      : 'border-white/70 bg-white/70 text-gray-700 hover:border-[#00C2FF]'
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

      {/* Grille */}
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
                const isEnCours = p.status === 'en_cours';

                return (
                  <button
                    key={p.id}
                    onClick={() => openProject(p)}
                    className={`group overflow-hidden rounded-2xl border-2 bg-white/70 text-left backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.border}`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={cover || '/images/placeholder.jpg'}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      
                      <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${styles.badge}`}>
                        {Icon && <Icon size={10} />} {catInfo?.label}
                      </span>

                      {/* 👇 NOUVEAU : Badge Statut sur la carte 👇 */}
                      <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${
                        isEnCours ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        {isEnCours ? '🚧 En cours' : '✅ Terminé'}
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
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0066FF]">
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

      {/* Modal Détail */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="group/carousel relative h-72 md:h-96" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
              <Image src={selectedProject.images[currentImageIndex]} alt={selectedProject.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              <button onClick={() => setSelectedProject(null)} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90"><FaTimes /></button>
              <button onClick={prevImage} className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"><FaChevronLeft size={14} /></button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"><FaChevronRight size={14} /></button>
              
              {/* 👇 NOUVEAU : Badges dans la modal 👇 */}
              <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${CATEGORY_STYLES[selectedProject.category].badge}`}>
                  {CATEGORY_LABELS[selectedProject.category]}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${
                  selectedProject.status === 'en_cours' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {selectedProject.status === 'en_cours' ? '🚧 En cours' : '✅ Terminé'}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
                <h2 className="text-2xl font-bold md:text-3xl">{selectedProject.title}</h2>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-200">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt size={12} /> {selectedProject.location}</span>
                  <span className="flex items-center gap-1.5"><FaCalendarAlt size={12} /> {selectedProject.year}</span>
                </div>
              </div>
            </div>
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
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                <Link href={`/realisations/${selectedProject.id}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-6 py-3 font-bold text-white transition hover:bg-[#0052cc]">
                  <FaExternalLinkAlt size={11} /> Voir la fiche complète
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}