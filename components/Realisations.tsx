'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog, FaTools,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaPause, FaPlay,
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
export type ProjectCategory =
  | 'securite'
  | 'solaire'
  | 'reseau'
  | 'domotique'
  | 'electricite'
  | 'automatisation'
  | 'maintenance';

export type Project = {
  id: number;
  title: string;
  category: ProjectCategory;
  date: string;            // 'YYYY-MM' → pour tri précis
  year: string;            // 'YYYY' → pour affichage
  location: string;
  client: string;
  images: string[];
  shortDesc: string;
  challenge: string;
  solution: string;
  result: string;
  features: string[];
};

/* ------------------------------------------------------------------ */
/*  STYLES PAR CATÉGORIE                                               */
/* ------------------------------------------------------------------ */
const CATEGORY_STYLES: Record<
  ProjectCategory,
  {
    border: string;
    badge: string;
    filterActive: string;
    dot: string;
  }
> = {
  securite: {
    border: 'border-red-300 hover:border-red-500 hover:shadow-red-500/20',
    badge: 'bg-red-500 text-white',
    filterActive: 'border-red-500 bg-red-500 text-white shadow-md shadow-red-500/30',
    dot: 'bg-red-500',
  },
  solaire: {
    border: 'border-amber-300 hover:border-amber-500 hover:shadow-amber-500/20',
    badge: 'bg-amber-500 text-white',
    filterActive: 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30',
    dot: 'bg-amber-500',
  },
  reseau: {
    border: 'border-blue-300 hover:border-blue-500 hover:shadow-blue-500/20',
    badge: 'bg-blue-500 text-white',
    filterActive: 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30',
    dot: 'bg-blue-500',
  },
  domotique: {
    border: 'border-purple-300 hover:border-purple-500 hover:shadow-purple-500/20',
    badge: 'bg-purple-500 text-white',
    filterActive: 'border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/30',
    dot: 'bg-purple-500',
  },
  electricite: {
    border: 'border-orange-300 hover:border-orange-500 hover:shadow-orange-500/20',
    badge: 'bg-orange-500 text-white',
    filterActive: 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30',
    dot: 'bg-orange-500',
  },
  automatisation: {
    border: 'border-cyan-300 hover:border-cyan-500 hover:shadow-cyan-500/20',
    badge: 'bg-cyan-500 text-white',
    filterActive: 'border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/30',
    dot: 'bg-cyan-500',
  },
  maintenance: {
    border: 'border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/20',
    badge: 'bg-emerald-500 text-white',
    filterActive: 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
    dot: 'bg-emerald-500',
  },
};

/* ------------------------------------------------------------------ */
/*  CATÉGORIES                                                         */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: 'all', label: 'Tous les projets', icon: null },
  { id: 'securite', label: 'Sécurité', icon: FaShieldAlt },
  { id: 'solaire', label: 'Solaire', icon: FaSun },
  { id: 'reseau', label: 'Réseau', icon: FaNetworkWired },
  { id: 'domotique', label: 'Domotique', icon: FaHome },
  { id: 'electricite', label: 'Électricité', icon: FaBolt },
  { id: 'automatisation', label: 'Automatisation', icon: FaCog },
  { id: 'maintenance', label: 'Maintenance', icon: FaTools },
];

/* ------------------------------------------------------------------ */
/*  DONNÉES                                                            */
/*  ⚠️ Le champ `date` est en 'YYYY-MM' (ex. '2025-11' = novembre 2025) */
/* ------------------------------------------------------------------ */
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Vidéosurveillance commerciale — Centre commercial',
    category: 'securite',
    date: '2025-11',
    year: '2025',
    location: 'Douala, Littoral',
    client: 'Groupe Retail CM',
    images: ['/images/projects/cctv.jpg', '/images/projects/cctv-2.jpg', '/images/projects/cctv-3.jpg'],
    shortDesc: 'Installation de 48 caméras IP 4K avec NVR redondant et monitoring 24/7.',
    challenge: 'Couvrir 12 000 m² de surface commerciale avec un accès distant pour 3 responsables et une conservation vidéo de 30 jours.',
    solution: 'Architecture IP full PoE avec 48 caméras 4K réparties sur 4 zones, NVR redondant, switchs PoE managés, accès mobile sécurisé.',
    result: 'Couverture 100% du site, temps de recherche réduit de 80%, aucune interruption depuis la mise en service.',
    features: ['48 caméras IP 4K', 'NVR redondant', 'Stockage 30 jours', 'Accès mobile'],
  },
  {
    id: 2,
    title: 'Installation solaire résidentielle 5 kWc',
    category: 'solaire',
    date: '2025-09',
    year: '2025',
    location: 'Yaoundé, Centre',
    client: 'Résidence privée',
    images: ['/images/projects/solar.jpg', '/images/projects/solar-2.jpg', '/images/projects/solar-3.jpg'],
    shortDesc: 'Système photovoltaïque hybride avec batteries lithium et onduleur 5 kVA.',
    challenge: 'Délestages fréquents impactant la vie quotidienne et les appareils électroniques.',
    solution: '12 panneaux monocristallins 450 Wc, onduleur hybride 5 kVA, 4 batteries lithium 5 kWh, régulateur MPPT.',
    result: 'Autonomie complète 8h/jour, facture Eneo réduite de 75%, zéro coupure depuis l’installation.',
    features: ['12 panneaux 450 Wc', 'Onduleur hybride 5 kVA', 'Batteries lithium 20 kWh', 'Monitoring mobile'],
  },
  {
    id: 3,
    title: 'Infrastructure réseau entreprise 200 postes',
    category: 'reseau',
    date: '2024-12',
    year: '2024',
    location: 'Douala, Littoral',
    client: 'Groupe industriel',
    images: ['/images/projects/network.jpg', '/images/projects/network-2.jpg', '/images/projects/network-3.jpg'],
    shortDesc: 'Câblage structuré, baies de brassage et Wi-Fi professionnel sur 3 bâtiments.',
    challenge: 'Réseau obsolète, lenteurs, câbles non documentés, aucune redondance.',
    solution: 'Refonte complète : 320 points RJ45 Cat6A, 4 baies, switchs empilables, Wi-Fi 6 sur 3 bâtiments, VLAN par service.',
    result: 'Débit multiplié par 10, disponibilité 99,9%, documentation complète livrée.',
    features: ['320 points RJ45', '4 baies de brassage', 'Wi-Fi 6', 'VLAN segmentés'],
  },
  {
    id: 4,
    title: 'Maison connectée — Villa 400 m²',
    category: 'domotique',
    date: '2025-08',
    year: '2025',
    location: 'Bafoussam, Ouest',
    client: 'Client privé',
    images: ['/images/projects/smart-home.jpg', '/images/projects/smart-home-2.jpg', '/images/projects/smart-home-3.jpg'],
    shortDesc: 'Domotique complète : éclairage, volets, clim, caméras et accès par smartphone.',
    challenge: 'Tout piloter depuis une seule application, avec scénarios automatiques.',
    solution: 'Système domotique centralisé, 45 modules (éclairage, prises, volets), capteurs présence, thermostats intelligents, caméras intégrées.',
    result: 'Confort optimal, économie d’énergie 30%, contrôle total depuis smartphone.',
    features: ['45 modules domotiques', 'Scénarios automatiques', 'Économie 30%', 'App mobile'],
  },
  {
    id: 5,
    title: 'Tableau électrique et mise aux normes',
    category: 'electricite',
    date: '2024-10',
    year: '2024',
    location: 'Douala, Littoral',
    client: 'Immeuble de bureaux',
    images: ['/images/projects/electrical.jpg', '/images/projects/electrical-2.jpg', '/images/projects/electrical-3.jpg'],
    shortDesc: 'Rénovation complète du tableau électrique et protection contre la foudre.',
    challenge: 'Tableau vétuste, disjoncteurs inadaptés, risque d’incendie, aucune protection parafoudre.',
    solution: 'Remplacement complet du tableau, disjoncteurs différentiels, parafoudre Type 2, mise à la terre renforcée.',
    result: 'Conformité totale, protection optimale, zéro incident électrique depuis.',
    features: ['Tableau neuf', 'Différentiels 30 mA', 'Parafoudre Type 2', 'Mise à la terre'],
  },
  {
    id: 6,
    title: 'Portail automatique coulissant 6 m',
    category: 'automatisation',
    date: '2025-07',
    year: '2025',
    location: 'Yaoundé, Centre',
    client: 'Résidence sécurisée',
    images: ['/images/projects/gate.jpg', '/images/projects/gate-2.jpg', '/images/projects/gate-3.jpg'],
    shortDesc: 'Motorisation de portail coulissant avec télécommande et interphone vidéo.',
    challenge: 'Portail manuel très lourd, accès difficile, besoin d’ouverture à distance.',
    solution: 'Motorisation coulissante 800 kg, cellule de sécurité, feu clignotant, interphone vidéo avec ouverture à distance.',
    result: 'Confort maximal, sécurité renforcée, ouverture depuis le bureau ou smartphone.',
    features: ['Moteur 800 kg', 'Cellule sécurité', 'Interphone vidéo', 'Ouverture distante'],
  },
  {
    id: 7,
    title: 'Contrôle d’accès — Siège social',
    category: 'securite',
    date: '2024-08',
    year: '2024',
    location: 'Douala, Littoral',
    client: 'Banque régionale',
    images: ['/images/projects/access.jpg', '/images/projects/access-2.jpg', '/images/projects/access-3.jpg'],
    shortDesc: 'Contrôle d’accès par badge et biométrie sur 6 portes stratégiques.',
    challenge: 'Tracer les entrées/sorties, gérer plusieurs niveaux d’accès, intégrer avec la vidéosurveillance.',
    solution: 'Lecteurs biométriques + badges Mifare, contrôleur central, gestion des droits par service, intégration CCTV.',
    result: 'Traçabilité complète, gestion centralisée, incidents réduits à zéro.',
    features: ['Biométrie + badge', '6 portes', 'Traçabilité', 'Intégration CCTV'],
  },
  {
    id: 8,
    title: 'Éclairage LED industriel — Entrepôt 3000 m²',
    category: 'electricite',
    date: '2025-06',
    year: '2025',
    location: 'Douala, Littoral',
    client: 'Plateforme logistique',
    images: ['/images/projects/led.jpg', '/images/projects/led-2.jpg', '/images/projects/led-3.jpg'],
    shortDesc: 'Remplacement de 200 luminaires par des LED haute performance.',
    challenge: 'Éclairage insuffisant, consommation électrique très élevée, coût de maintenance important.',
    solution: '200 luminaires LED industriels IP65 150W, détecteurs de présence, variateur selon luminosité naturelle.',
    result: 'Économie d’énergie 60%, luminosité améliorée 3x, maintenance réduite.',
    features: ['200 LED IP65', 'Détecteurs présence', 'Économie 60%', 'Gradation auto'],
  },
  {
    id: 9,
    title: 'Contrat de maintenance préventive — Résidence R+2',
    category: 'maintenance',
    date: '2025-10',
    year: '2025',
    location: 'Yaoundé, Bastos',
    client: 'Syndic de copropriété',
    images: ['/images/projects/maintenance-1.jpg', '/images/projects/maintenance-2.jpg', '/images/projects/maintenance-3.jpg'],
    shortDesc: 'Contrat annuel couvrant électricité, solaire, sécurité et entretien général.',
    challenge: 'Éviter les pannes, rallonger la durée de vie des équipements, garantir la disponibilité des systèmes 24/7.',
    solution: 'Visites préventives trimestrielles, intervention prioritaire 24h, registre numérique de suivi, pièces de rechange en stock.',
    result: 'Zéro panne majeure sur 12 mois, durée de vie des équipements prolongée, budget maintenance maîtrisé.',
    features: ['4 visites/an', 'Intervention 24h', 'Registre numérique', 'Pièces en stock'],
  },
  {
    id: 10,
    title: 'Dépannage urgent — Remise en service alarme & CCTV',
    category: 'maintenance',
    date: '2025-05',
    year: '2025',
    location: 'Douala, Akwa',
    client: 'Pharmacie',
    images: ['/images/projects/depannage-1.jpg', '/images/projects/depannage-2.jpg', '/images/projects/depannage-3.jpg'],
    shortDesc: 'Intervention d’urgence suite à un orage : diagnostic, réparation et reconfiguration.',
    challenge: 'Système d’alarme et de vidéosurveillance hors service après un orage, urgence sécuritaire.',
    solution: 'Diagnostic en 2h, remplacement des modules endommagés, reconfiguration complète, mise en place d’un parafoudre.',
    result: 'Système 100% opérationnel dans la journée, protection parafoudre installée, contrat de maintenance signé.',
    features: ['Intervention 2h', 'Remplacement modules', 'Parafoudre ajouté', 'Contrat signé'],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPOSANT PRINCIPAL                                                */
/* ------------------------------------------------------------------ */
export default function Realisations() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  /* ---------- FILTRAGE + TRI PAR DATE (plus récent en haut) ---------- */
  const filtered = useMemo(() => {
    // 1. Filtrer
    const list =
      activeCategory === 'all'
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeCategory);

    // 2. Trier par date décroissante (YYYY-MM)
    //    b.date.localeCompare(a.date) → 2025-11 avant 2025-10 avant 2024-12…
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
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

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
                cat.id !== 'all'
                  ? CATEGORY_STYLES[cat.id as ProjectCategory]
                  : null;

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

                      {/* Badge catégorie coloré */}
                      <span
                        className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${styles.badge}`}
                      >
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
                        <p className="line-clamp-2 text-base font-bold leading-tight">
                          {p.title}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt size={10} /> {p.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} /> {p.year}
                        </span>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {p.shortDesc}
                      </p>
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

              {/* Badge catégorie coloré */}
              <div className="absolute left-4 top-4 z-20">
                {(() => {
                  const catInfo = CATEGORIES.find((c) => c.id === selectedProject.category);
                  const Icon = catInfo?.icon;
                  const styles = CATEGORY_STYLES[selectedProject.category];
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-md ${styles.badge}`}
                    >
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
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={12} /> {selectedProject.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt size={12} /> {selectedProject.year}
                  </span>
                  <span className="flex items-center gap-1.5">👤 {selectedProject.client}</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                {selectedProject.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'w-6 bg-[#00C2FF]'
                        : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Contenu détail */}
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                  Aperçu
                </h3>
                <p className="leading-relaxed text-gray-700">{selectedProject.shortDesc}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">
                    🎯 Défi
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                    💡 Solution
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">
                  ✅ Résultat
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  {selectedProject.result}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                  Points clés du projet
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {selectedProject.features.map((f) => (
                    <div
                      key={f}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center"
                    >
                      <FaCheckCircle className="mx-auto mb-1 text-[#00C2FF]" size={14} />
                      <p className="text-xs font-semibold leading-tight text-gray-700">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <Link
                  href="/devis"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-8 py-3 font-bold text-white transition hover:bg-[#0052cc] md:w-auto"
                >
                  Demander un devis similaire <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}