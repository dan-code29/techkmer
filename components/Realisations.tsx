'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog,
  FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaCheckCircle,
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
export type Project = {
  id: number;
  title: string;
  category: 'securite' | 'solaire' | 'reseau' | 'domotique' | 'electricite' | 'automatisation';
  location: string;
  year: string;
  client: string;
  image: string;
  shortDesc: string;
  challenge: string;
  solution: string;
  result: string;
  features: string[];
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
];

/* ------------------------------------------------------------------ */
/*  DONNÉES                                                            */
/* ------------------------------------------------------------------ */
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Vidéosurveillance commerciale — Centre commercial',
    category: 'securite',
    location: 'Douala, Littoral',
    year: '2025',
    client: 'Groupe Retail CM',
    image: '/images/projects/cctv.jpg',
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
    location: 'Yaoundé, Centre',
    year: '2025',
    client: 'Résidence privée',
    image: '/images/projects/solar.jpg',
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
    location: 'Douala, Littoral',
    year: '2024',
    client: 'Groupe industriel',
    image: '/images/projects/network.jpg',
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
    location: 'Bafoussam, Ouest',
    year: '2025',
    client: 'Client privé',
    image: '/images/projects/smart-home.jpg',
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
    location: 'Douala, Littoral',
    year: '2024',
    client: 'Immeuble de bureaux',
    image: '/images/projects/electrical.jpg',
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
    location: 'Yaoundé, Centre',
    year: '2025',
    client: 'Résidence sécurisée',
    image: '/images/projects/gate.jpg',
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
    location: 'Douala, Littoral',
    year: '2024',
    client: 'Banque régionale',
    image: '/images/projects/access.jpg',
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
    location: 'Douala, Littoral',
    year: '2025',
    client: 'Plateforme logistique',
    image: '/images/projects/led.jpg',
    shortDesc: 'Remplacement de 200 luminaires par des LED haute performance.',
    challenge: 'Éclairage insuffisant, consommation électrique très élevée, coût de maintenance important.',
    solution: '200 luminaires LED industriels IP65 150W, détecteurs de présence, variateur selon luminosité naturelle.',
    result: 'Économie d’énergie 60%, luminosité améliorée 3x, maintenance réduite.',
    features: ['200 LED IP65', 'Détecteurs présence', 'Économie 60%', 'Gradation auto'],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPOSANT PRINCIPAL                                                */
/* ------------------------------------------------------------------ */
export default function Realisations() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-white">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative bg-[#050B16] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/projects/hero.jpg"
            alt="Réalisations WISE BUILD"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/90 to-[#050B16]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_45%)] opacity-20" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 py-24 md:py-28 max-w-3xl">
          <span className="inline-block bg-[#0066FF]/20 border border-[#00C2FF]/40 text-[#00C2FF] text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            PORTFOLIO
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Nos <span className="text-[#00C2FF]">réalisations</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Découvrez quelques projets que nous avons menés à travers le Cameroun —
            sécurité, solaire, réseau, domotique, électricité et automatisation.
          </p>

          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#00C2FF]">150+</p>
              <p className="text-sm text-gray-400">Projets livrés</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#00C2FF]">10</p>
              <p className="text-sm text-gray-400">Régions couvertes</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#00C2FF]">100%</p>
              <p className="text-sm text-gray-400">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FILTRES                                                     */}
      {/* ============================================================ */}
      <section className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition border ${
                    active
                      ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#00C2FF] hover:text-[#0066FF]'
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

      {/* ============================================================ */}
      {/*  GRILLE                                                      */}
      {/* ============================================================ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Aucun projet dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => {
                const catInfo = CATEGORIES.find((c) => c.id === p.category);
                const Icon = catInfo?.icon || null;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="group text-left bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#00C2FF] text-[#050B16] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                        {Icon && <Icon size={10} />}
                        {catInfo?.label}
                      </span>
                      <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-sm">
                        {p.year}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-bold text-base leading-tight line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt size={10} /> {p.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} /> {p.year}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {p.shortDesc}
                      </p>
                      <span className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section className="py-20 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Votre projet mérite la même exigence.
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Parlons de votre besoin. Devis gratuit sous 24h.
          </p>
          <Link
            href="/devis"
            className="inline-block bg-white text-[#0066FF] font-bold py-4 px-10 rounded-lg transition hover:bg-gray-100 shadow-xl"
          >
            Demander un devis gratuit
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MODAL DÉTAIL                                                */}
      {/* ============================================================ */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 md:h-96">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition"
                aria-label="Fermer"
              >
                <FaTimes />
              </button>

              <div className="absolute top-4 left-4">
                {(() => {
                  const catInfo = CATEGORIES.find((c) => c.id === selectedProject.category);
                  const Icon = catInfo?.icon;
                  return (
                    <span className="inline-flex items-center gap-1.5 bg-[#00C2FF] text-[#050B16] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {Icon && <Icon size={12} />}
                      {catInfo?.label}
                    </span>
                  );
                })()}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {selectedProject.title}
                </h2>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-200">
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={12} /> {selectedProject.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt size={12} /> {selectedProject.year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    👤 {selectedProject.client}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0066FF] mb-2">
                  Aperçu
                </h3>
                <p className="text-gray-700 leading-relaxed">{selectedProject.shortDesc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">
                    🎯 Défi
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                    💡 Solution
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">
                  ✅ Résultat
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedProject.result}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0066FF] mb-3">
                  Points clés du projet
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedProject.features.map((f) => (
                    <div
                      key={f}
                      className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center"
                    >
                      <FaCheckCircle className="text-[#00C2FF] mx-auto mb-1" size={14} />
                      <p className="text-xs font-semibold text-gray-700 leading-tight">
                        {f}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link
                  href="/devis"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-3 px-8 rounded-lg transition"
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