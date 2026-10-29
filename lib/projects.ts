/* ================================================================== */
/*  LIB/PROJECTS.TS                                                    */
/*  ------------------------------------------------------------------ */
/*  Source de vérité UNIQUE pour toutes les réalisations.              */
/*  Utilisé par :                                                       */
/*    - components/Realisations.tsx  (page /realisations)              */
/*    - components/HomeRealisations.tsx (section home)                 */
/*    - app/realisations/[id]/page.tsx (page détail)                   */
/*                                                                     */
/*  💡 Ajouter un projet = ajouter une entrée dans PROJECTS.           */
/*     Il apparaîtra automatiquement dans les 3 endroits.              */
/* ================================================================== */

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
  date: string;            // 'YYYY-MM' → tri précis
  year: string;            // 'YYYY' → affichage
  location: string;
  client: string;
  images: string[];        // [0] = couverture, les autres = galerie
  shortDesc: string;
  challenge: string;
  solution: string;
  result: string;
  features: string[];
};

/* ------------------------------------------------------------------ */
/*  LABELS                                                             */
/* ------------------------------------------------------------------ */
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  securite: 'Sécurité',
  solaire: 'Solaire',
  reseau: 'Réseau',
  domotique: 'Domotique',
  electricite: 'Électricité',
  automatisation: 'Automatisation',
  maintenance: 'Maintenance',
};

/* ------------------------------------------------------------------ */
/*  ORDRE D'AFFICHAGE (utilisé pour la rotation home)                  */
/* ------------------------------------------------------------------ */
export const CATEGORY_ORDER: ProjectCategory[] = [
  'securite',
  'solaire',
  'reseau',
  'domotique',
  'electricite',
  'automatisation',
  'maintenance',
];

/* ------------------------------------------------------------------ */
/*  STYLES PAR CATÉGORIE (bordure / badge / filtre actif)              */
/* ------------------------------------------------------------------ */
export const CATEGORY_STYLES: Record<
  ProjectCategory,
  { border: string; badge: string; filterActive: string; dot: string }
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
/*  DONNÉES DES PROJETS                                                */
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
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Choisit un projet AU HASARD dans une catégorie donnée.
 * - `excludeId` : évite de retomber sur le même projet (rotation)
 * - Si la catégorie ne contient qu'1 projet, il est retourné quand même
 */
export function pickProjectForCategory(
  cat: ProjectCategory,
  excludeId?: number
): Project | null {
  const pool = PROJECTS.filter((p) => p.category === cat && p.id !== excludeId);
  if (pool.length === 0) {
    return PROJECTS.find((p) => p.category === cat) || null;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Retourne un projet aléatoire par catégorie (pour l'état initial) */
export function pickAllCategories(): Record<ProjectCategory, Project | null> {
  const result = {} as Record<ProjectCategory, Project | null>;
  CATEGORY_ORDER.forEach((cat) => {
    result[cat] = pickProjectForCategory(cat);
  });
  return result;
}