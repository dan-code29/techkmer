/* ================================================================== */
/*  LIB/SOLUTIONS.TS                                                   */
/*  ------------------------------------------------------------------ */
/*  Ce fichier centralise TOUTES les données des 5 solutions            */
/*  techniques de CHEFFBUILD.                                           */
/*                                                                     */
/*  💡 Avantages :                                                      */
/*  - Une seule source de vérité (pas de duplication)                  */
/*  - Ajouter une solution = ajouter une entrée dans le tableau        */
/*  - Facile à migrer vers une DB (Prisma/Turso) plus tard             */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

/** Slug unique de chaque solution (utilisé dans les URLs) */
export type SolutionCategory =
  | 'electrical'
  | 'connectivity'
  | 'smart'
  | 'security'
  | 'automation';

/** Service individuel proposé par une solution */
export type SolutionService = {
  icon: string;         // Emoji pour l'affichage
  title: string;        // Nom du service
  desc: string;         // Description courte
};

/** Étape du processus (méthode en 4 étapes) */
export type SolutionProcessStep = {
  step: string;         // '01', '02', '03', '04'
  title: string;
  desc: string;
};

/** Solution complète */
export type Solution = {
  slug: SolutionCategory;
  name: string;          // 'CHEFFBUILD ELECTRICAL'
  tagline: string;       // 'Énergie & Solaire'
  icon: string;          // Emoji principal
  heroImage?: string;    // Image d'illustration (optionnel pour l'instant)

  /** Couleurs Tailwind associées à cette solution */
  colors: {
    badge: string;       // ex: 'bg-orange-500 text-white'
    border: string;      // ex: 'border-orange-300 hover:border-orange-500'
    gradient: string;    // ex: 'from-orange-500 to-orange-400'
    accent: string;      // ex: 'text-orange-500'
    softBg: string;      // ex: 'bg-orange-50'
  };

  shortDesc: string;     // Description courte (listing)
  longDesc: string;      // Description longue (page détail)
  services: SolutionService[];
  benefits: string[];    // Points forts / avantages
  process: SolutionProcessStep[];
  ctaText: string;       // Texte du bouton CTA spécifique
};

/* ------------------------------------------------------------------ */
/*  DONNÉES — LES 5 SOLUTIONS                                          */
/* ------------------------------------------------------------------ */

export const SOLUTIONS: Solution[] = [
  /* ============================================================ */
  /*  1. ELECTRICAL — Énergie & Solaire                           */
  /* ============================================================ */
  {
    slug: 'electrical',
    name: 'CHEFFBUILD ELECTRICAL',
    tagline: 'Énergie & Solaire',
    icon: '⚡',
    colors: {
      badge: 'bg-orange-500 text-white',
      border: 'border-orange-300 hover:border-orange-500 hover:shadow-orange-500/20',
      gradient: 'from-orange-500 to-orange-400',
      accent: 'text-orange-500',
      softBg: 'bg-orange-50',
    },
    shortDesc:
      'Électricité bâtiment, énergie solaire, batteries lithium et éclairage LED — de l’étude à la mise en service.',
    longDesc:
      'CHEFFBUILD ELECTRICAL conçoit et installe vos installations électriques complètes, qu’il s’agisse de constructions neuves ou de rénovations. Nous sécurisons votre alimentation en énergie, optimisons vos consommations et vous accompagnons vers l’autonomie grâce à des solutions solaires sur mesure. Nos techniciens certifiés interviennent sur tous types de bâtiments, en respectant les normes en vigueur et en vous garantissant un travail propre, documenté et durable.',
    services: [
      { icon: '🔌', title: 'Installation électrique bâtiment', desc: 'Neuf et rénovation, tableaux, circuits, mise aux normes NF C 15-100.' },
      { icon: '☀️', title: 'Panneaux solaires photovoltaïques', desc: 'Dimensionnement, pose et raccordement de systèmes solaires adaptés à vos besoins.' },
      { icon: '🔋', title: 'Batteries lithium & onduleurs hybrides', desc: 'Stockage d’énergie pour une autonomie totale ou partielle.' },
      { icon: '💡', title: 'Éclairage intérieur & extérieur', desc: 'LED, éclairage architectural, éclairage de sécurité.' },
      { icon: '🛡️', title: 'Protection & mise à la terre', desc: 'Parafoudre, différentiels, mise à la terre renforcée.' },
      { icon: '🔧', title: 'Dépannage & maintenance', desc: 'Intervention rapide, diagnostic, réparation et entretien préventif.' },
    ],
    benefits: [
      'Techniciens certifiés et expérimentés',
      'Matériel de marques reconnues (Schneider, Legrand)',
      'Conformité aux normes NF C 15-100',
      'Devis transparent et détaillé sous 24h',
      'Garantie 12 mois sur l’installation',
    ],
    process: [
      { step: '01', title: 'Audit du besoin', desc: 'Analyse de votre consommation et de vos contraintes.' },
      { step: '02', title: 'Étude technique', desc: 'Dimensionnement et proposition détaillée.' },
      { step: '03', title: 'Installation', desc: 'Pose, câblage et mise en service.' },
      { step: '04', title: 'Maintenance', desc: 'Suivi, entretien et assistance continue.' },
    ],
    ctaText: 'Demander un audit énergétique',
  },

  /* ============================================================ */
  /*  2. CONNECTIVITY — Réseaux & Informatique                    */
  /* ============================================================ */
  {
    slug: 'connectivity',
    name: 'CHEFFBUILD CONNECTIVITY',
    tagline: 'Réseaux & Informatique',
    icon: '🌐',
    colors: {
      badge: 'bg-blue-500 text-white',
      border: 'border-blue-300 hover:border-blue-500 hover:shadow-blue-500/20',
      gradient: 'from-blue-500 to-blue-400',
      accent: 'text-blue-500',
      softBg: 'bg-blue-50',
    },
    shortDesc:
      'Câblage structuré, fibre optique, Wi-Fi 6 professionnel et baies de brassage pour un réseau fiable et performant.',
    longDesc:
      'CHEFFBUILD CONNECTIVITY conçoit des infrastructures réseau complètes et évolutives. Du câblage structuré aux solutions Wi-Fi professionnelles, en passant par la téléphonie IP et les serveurs, nous mettons en place un réseau documenté, redondant et adapté à votre activité. Que ce soit pour un bureau, un hôtel ou un campus, nous garantissons performance, sécurité et évolutivité.',
    services: [
      { icon: '🔗', title: 'Câblage structuré RJ45 / fibre', desc: 'Cat6, Cat6A, fibre optique — documentation complète livrée.' },
      { icon: '📶', title: 'Wi-Fi 6 professionnel', desc: 'Couverture optimale multi-bâtiments, roaming sans coupure.' },
      { icon: '🗄️', title: 'Baies de brassage', desc: 'Conception, installation et organisation de baies équipées.' },
      { icon: '🖧', title: 'Switchs, routeurs, points d’accès', desc: 'Marques pro (Ubiquiti, TP-Link, Cisco).' },
      { icon: '📞', title: 'Téléphonie IP', desc: 'Standard téléphonique, softphone, intégration CRM.' },
      { icon: '💾', title: 'Serveurs & sauvegarde', desc: 'NAS, serveurs locaux, sauvegarde cloud et redondance.' },
    ],
    benefits: [
      'Réseau documenté et évolutif',
      'Matériel professionnel (Ubiquiti, TP-Link, Cisco)',
      'Sécurité par VLAN et segmentation',
      'Disponibilité 99,9% grâce à la redondance',
      'Assistance et supervision après installation',
    ],
    process: [
      { step: '01', title: 'Audit réseau', desc: 'Analyse de l’existant et des besoins.' },
      { step: '02', title: 'Architecture', desc: 'Conception topologique et plan de câblage.' },
      { step: '03', title: 'Déploiement', desc: 'Câblage, installation et configuration.' },
      { step: '04', title: 'Supervision', desc: 'Suivi des performances et maintenance.' },
    ],
    ctaText: 'Demander une étude réseau',
  },

  /* ============================================================ */
  /*  3. SMART — Domotique & Smart Building                       */
  /* ============================================================ */
  {
    slug: 'smart',
    name: 'CHEFFBUILD SMART',
    tagline: 'Domotique & Smart Building',
    icon: '🏠',
    colors: {
      badge: 'bg-purple-500 text-white',
      border: 'border-purple-300 hover:border-purple-500 hover:shadow-purple-500/20',
      gradient: 'from-purple-500 to-purple-400',
      accent: 'text-purple-500',
      softBg: 'bg-purple-50',
    },
    shortDesc:
      'Domotique résidentielle et tertiaire : éclairage intelligent, thermostats connectés, contrôle à distance.',
    longDesc:
      'CHEFFBUILD SMART transforme votre bâtiment en espace intelligent, confortable et économe en énergie. Nous intégrons les technologies domotiques les plus récentes (KNX, Zigbee, Wi-Fi) dans une interface unifiée, pilotable depuis votre smartphone ou par la voix. Scénarios d’éclairage, gestion du chauffage et de la climatisation, sécurité intégrée : tout devient simple et intuitif.',
    services: [
      { icon: '🏡', title: 'Domotique résidentielle & tertiaire', desc: 'Solutions sur mesure pour villas, bureaux et hôtels.' },
      { icon: '💡', title: 'Éclairage intelligent & scénarios', desc: 'Ambiances programmables, détection de présence, gradation.' },
      { icon: '🌡️', title: 'Thermostats connectés', desc: 'Gestion intelligente du chauffage et de la climatisation.' },
      { icon: '🔗', title: 'Intégration multi-protocoles', desc: 'KNX, Zigbee, Wi-Fi, Z-Wave — un seul système.' },
      { icon: '📱', title: 'Contrôle à distance via smartphone', desc: 'Application mobile iOS/Android, contrôle vocal.' },
      { icon: '🌉', title: 'Passerelle centralisée', desc: 'Un point de contrôle unique pour tout votre bâtiment.' },
    ],
    benefits: [
      'Jusqu’à 30% d’économies d’énergie',
      'Confort et bien-être optimisés',
      'Interface unique et intuitive',
      'Intégration avec la sécurité et l’électricité',
      'Évolutif : ajoutez des modules quand vous voulez',
    ],
    process: [
      { step: '01', title: 'Écoute du besoin', desc: 'Comprendre vos usages et vos habitudes.' },
      { step: '02', title: 'Conception', desc: 'Scénarios, choix des protocoles et des équipements.' },
      { step: '03', title: 'Intégration', desc: 'Installation, câblage et paramétrage.' },
      { step: '04', title: 'Formation', desc: 'Prise en main de votre système et suivi.' },
    ],
    ctaText: 'Concevoir ma maison connectée',
  },

  /* ============================================================ */
  /*  4. SECURITY — Sécurité électronique                         */
  /* ============================================================ */
  {
    slug: 'security',
    name: 'CHEFFBUILD SECURITY',
    tagline: 'Sécurité électronique',
    icon: '🛡️',
    colors: {
      badge: 'bg-red-500 text-white',
      border: 'border-red-300 hover:border-red-500 hover:shadow-red-500/20',
      gradient: 'from-red-500 to-red-400',
      accent: 'text-red-500',
      softBg: 'bg-red-50',
    },
    shortDesc:
      'Vidéosurveillance IP 4K, alarmes intrusion, contrôle d’accès et interphonie vidéo — la sécurité de A à Z.',
    longDesc:
      'CHEFFBUILD SECURITY protège ce qui compte le plus pour vous : vos biens, vos collaborateurs et vos proches. Nous concevons des systèmes de sécurité complets, fiables et discrets : vidéosurveillance HD/4K, alarmes anti-intrusion, contrôle d’accès biométrique, clôtures électriques et supervision intelligente. Chaque installation est dimensionnée selon vos risques et vos contraintes.',
    services: [
      { icon: '📹', title: 'Vidéosurveillance IP HD/4K', desc: 'Caméras haute résolution, vision nocturne, analyse IA.' },
      { icon: '💾', title: 'NVR / XVR & stockage sécurisé', desc: 'Enregistrement redondant, conservation configurable.' },
      { icon: '🚨', title: 'Alarmes intrusion', desc: 'Centrales filaires/radio, détecteurs de mouvement, sirènes.' },
      { icon: '🔐', title: 'Contrôle d’accès', desc: 'Badges, biométrie, gestion centralisée des droits.' },
      { icon: '⚡', title: 'Clôtures électriques', desc: 'Dissuasion active, conformité et intégration au système.' },
      { icon: '📺', title: 'Interphonie vidéo', desc: 'Communication et ouverture à distance, enregistrement des visites.' },
    ],
    benefits: [
      'Matériel pro (Hikvision, Dahua)',
      'Supervision 24/7 possible',
      'Accès distant via smartphone',
      'Intégration avec l’électricité et l’automatisation',
      'Intervention rapide en cas de panne',
    ],
    process: [
      { step: '01', title: 'Diagnostic sécurité', desc: 'Analyse des risques et des zones à protéger.' },
      { step: '02', title: 'Conception', desc: 'Architecture du système et choix des équipements.' },
      { step: '03', title: 'Installation', desc: 'Pose discrète et configuration complète.' },
      { step: '04', title: 'Supervision', desc: 'Suivi, maintenance et mises à jour.' },
    ],
    ctaText: 'Sécuriser mon bâtiment',
  },

  /* ============================================================ */
  /*  5. AUTOMATION — Automatisation                              */
  /* ============================================================ */
  {
    slug: 'automation',
    name: 'CHEFFBUILD AUTOMATION',
    tagline: 'Automatisation',
    icon: '⚙️',
    colors: {
      badge: 'bg-cyan-500 text-white',
      border: 'border-cyan-300 hover:border-cyan-500 hover:shadow-cyan-500/20',
      gradient: 'from-cyan-500 to-cyan-400',
      accent: 'text-cyan-500',
      softBg: 'bg-cyan-50',
    },
    shortDesc:
      'Motorisation de portails, portes de garage, barrières et portiques — confort et sécurité au quotidien.',
    longDesc:
      'CHEFFBUILD AUTOMATION automatise les accès de votre propriété ou de votre site. Motorisation de portails coulissants ou battants, portes de garage, barrières de parking, portiques et systèmes de contrôle : nous rendons chaque entrée plus fluide, plus sûre et plus simple à gérer. Nos solutions sont compatibles avec les télécommandes, applications mobiles et systèmes de contrôle d’accès.',
    services: [
      { icon: '🚪', title: 'Motorisation de portails', desc: 'Coulissants et battants, jusqu’à 1500 kg.' },
      { icon: '🏠', title: 'Portes de garage automatiques', desc: 'Sectionnelles, basculantes et enroulables.' },
      { icon: '🚧', title: 'Barrières & portiques', desc: 'Contrôle d’accès véhicules, parkings privés.' },
      { icon: '📱', title: 'Contrôle à distance', desc: 'Télécommande + application mobile.' },
      { icon: '🛡️', title: 'Sécurité anti-pincement', desc: 'Cellules photoélectriques et détection d’obstacle.' },
      { icon: '🔧', title: 'Maintenance & SAV', desc: 'Contrats d’entretien et dépannage rapide.' },
    ],
    benefits: [
      'Confort d’utilisation au quotidien',
      'Sécurité renforcée (anti-pincement, anti-effraction)',
      'Compatible télécommande + smartphone',
      'Motorisation puissante (jusqu’à 1500 kg)',
      'Maintenance incluse en option',
    ],
    process: [
      { step: '01', title: 'Visite technique', desc: 'Évaluation du portail et des contraintes.' },
      { step: '02', title: 'Devis détaillé', desc: 'Proposition de motorisation adaptée.' },
      { step: '03', title: 'Installation', desc: 'Pose du moteur, câblage et tests.' },
      { step: '04', title: 'Formation & SAV', desc: 'Prise en main et service après-vente.' },
    ],
    ctaText: 'Automatiser mon accès',
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/** Récupérer une solution par son slug (retourne undefined si introuvable) */
export function getSolutionBySlug(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

/** Liste des slugs pour generateStaticParams */
export function getAllSolutionSlugs(): SolutionCategory[] {
  return SOLUTIONS.map((s) => s.slug);
}