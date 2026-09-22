// ============================================================================
//  CHEFFBUILD — CONFIGURATEUR v3 (orienté besoins + dynamique)
// ============================================================================

// ============================================================================
//  TYPES
// ============================================================================

// ✅ Les domaines/besoins que le client peut sélectionner
export type Domain =
  | 'electrical'      // Électricité bâtiment
  | 'solar'           // Énergie solaire
  | 'network'         // Réseau & Wi-Fi
  | 'security'        // Vidéosurveillance / alarme / contrôle d'accès
  | 'smart'           // Domotique
  | 'automation'      // Portails & portes motorisées
  | 'fence'           // Clôture électrique
  | 'maintenance';    // Rénovation / dépannage

export type ProjectType = 'maison' | 'appartement' | 'bureau' | 'commerce' | 'entrepot';
export type EquipLevel = 'none' | 'basic' | 'standard' | 'premium';
export type SupportComplexity = 'neuf' | 'renovation-legere' | 'renovation-lourde';
export type GateType = 'sliding' | 'swing';

// ✅ STRUCTURE PRINCIPALE
export type ConfiguratorInput = {
  // ---- Étape 1 : besoins ----
  domains: Domain[];

  // ---- Étape 2 : bâtiment (champs conditionnels) ----
  projectType: ProjectType;
  surface: number;              // m² (0 si non concerné)
  rooms: number;                // 0 si non concerné
  floors: number;               // 1 à 5 (ou personnalisé)
  customFloors?: number;        // si l'utilisateur saisit son propre nombre
  supportComplexity: SupportComplexity;

  // ---- Étape 2b : spécifique clôture ----
  perimeter?: number;           // mètres linéaires de clôture

  // ---- Étape 2c : spécifique automatisation ----
  gateCount?: number;
  gateType?: GateType;

  // ---- Étape 3 : niveaux par domaine ----
  levels: Partial<Record<Domain, EquipLevel>>;
};

// Type de ligne générée
export type GeneratedItem = {
  category: string;
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
  icon: string;
  priority: 'essentiel' | 'confort' | 'premium';
  note?: string;
  trade?: Trade;
  isConsumable?: boolean;
};

export type Trade = 'electricien' | 'reseau' | 'securite' | 'domotique' | 'solaire' | 'automatisme' | 'maintenance';

export type CustomPrices = Partial<Record<string, number>>;
export type CustomLaborRates = Partial<Record<Trade, number>>;

// ============================================================================
//  CONSTANTES
// ============================================================================

export const PROJECT_MULTIPLIERS: Record<ProjectType, number> = {
  appartement: 0.9,
  maison: 1.0,
  bureau: 1.4,
  commerce: 1.6,
  entrepot: 1.2,
};

export const COMPLEXITY_MULTIPLIERS: Record<
  SupportComplexity,
  { labor: number; materials: number; label: string }
> = {
  'neuf': { labor: 1.0, materials: 1.0, label: 'Neuf / Faux-plafond (facile)' },
  'renovation-legere': { labor: 1.2, materials: 1.1, label: 'Rénovation légère (cloison légère)' },
  'renovation-lourde': { labor: 1.5, materials: 1.25, label: 'Rénovation lourde (murs pleins à rainurer)' },
};

export const LABOR_RATES: Record<Trade, number> = {
  electricien: 5000,
  reseau: 7500,
  securite: 7000,
  domotique: 9000,
  solaire: 8000,
  automatisme: 6500,
  maintenance: 6000,
};

const UNIT_PRICES: Record<string, number> = {
  // Électricité
  prise: 5000,
  priseDediee: 15000,
  interrupteur: 3500,
  tableau: 150000,
  tableauDivisionnaire: 85000,
  pointLumineux: 8000,
  parafoudre: 45000,
  // Solaire
  panneau300W: 45000,
  batterie5kWh: 250000,
  onduleur3kVA: 180000,
  regulateurMPPT: 95000,
  // Réseau
  priseRJ45: 8000,
  switch16ports: 45000,
  switchPoE: 125000,
  wifiAP: 35000,
  baie9U: 45000,
  baie22U: 175000,
  // Sécurité
  cameraIP: 25000,
  nvr8ch: 50000,
  nvr16ch: 85000,
  disque1To: 55000,
  alarme: 85000,
  lecteurAcces: 35000,
  interphone: 65000,
  // Domotique
  moduleDomotique: 25000,
  thermostatIntelligent: 45000,
  passerelleDomotique: 150000,
  // Automatisation
  motorisationPortail: 350000,
  motorisationPorte: 450000,
  // Clôture électrique
  clotureLineaire: 12000,        // par mètre linéaire
  energiseurCloture: 150000,
  // Maintenance
  forfaitDiagnostic: 50000,
  forfaitIntervention: 100000,
  // Consommables
  cableUTP: 2500,
  cableElec: 1800,
  gaineICTA: 800,
  goulottePVC: 1200,
  boiteDerivation: 1500,
};

// ============================================================================
//  ✅ FONCTION : Détermine les champs nécessaires selon les domaines choisis
// ============================================================================
export function getRequiredFields(domains: Domain[]) {
  // Domaines qui nécessitent les infos de surface/pièces/étages
  const needsBuilding = domains.some((d) =>
    ['electrical', 'solar', 'network', 'security', 'smart', 'maintenance'].includes(d)
  );

  const needsSurface = domains.some((d) =>
    ['electrical', 'solar', 'network', 'security', 'smart', 'maintenance'].includes(d)
  );

  const needsRooms = domains.some((d) =>
    ['electrical', 'network', 'smart', 'maintenance'].includes(d)
  );

  const needsFloors = domains.some((d) =>
    ['electrical', 'network', 'security', 'smart'].includes(d)
  );

  const needsComplexity = domains.some((d) =>
    ['electrical', 'network', 'maintenance'].includes(d)
  );

  const needsPerimeter = domains.includes('fence');
  const needsGate = domains.includes('automation');

  return {
    needsBuilding,
    needsSurface,
    needsRooms,
    needsFloors,
    needsComplexity,
    needsPerimeter,
    needsGate,
    // Un seul domaine "simple" → pas besoin de toutes les infos
    isSimpleProject:
      domains.length === 1 && ['automation', 'fence', 'maintenance'].includes(domains[0]),
  };
}

// ============================================================================
//  ✅ GÉNÉRATEUR D'ÉQUIPEMENTS (filtré par domaines choisis)
// ============================================================================
export function generateEquipmentList(
  input: ConfiguratorInput,
  customPrices?: CustomPrices
): GeneratedItem[] {
  const items: GeneratedItem[] = [];
  const domains = input.domains || [];
  const mult = PROJECT_MULTIPLIERS[input.projectType] ?? 1.0;
  const complexity = COMPLEXITY_MULTIPLIERS[input.supportComplexity] ?? COMPLEXITY_MULTIPLIERS['neuf'];
  const surface = input.surface || 0;
  const rooms = input.rooms || 0;
  const floors = Math.max(1, input.floors ?? 1);
  const floorFactor = 1 + (floors - 1) * 0.4;

  const price = (key: string): number => customPrices?.[key] ?? UNIT_PRICES[key] ?? 0;
  const getLevel = (d: Domain): EquipLevel => input.levels?.[d] || 'none';

  // ==========================================================================
  //  ⚡ ÉLECTRICITÉ
  // ==========================================================================
  if (domains.includes('electrical') && getLevel('electrical') !== 'none') {
    const level = getLevel('electrical');

    const lumineux = Math.ceil((surface / 15) * mult * floorFactor);
    items.push({
      category: 'Electrical',
      label: 'Points lumineux (plafonniers, spots)',
      quantity: lumineux,
      unitPrice: price('pointLumineux'),
      total: lumineux * price('pointLumineux'),
      icon: '💡',
      priority: 'essentiel',
      note: `Réparti sur ${floors} niveau${floors > 1 ? 'x' : ''}`,
      trade: 'electricien',
    });

    const prises = Math.ceil((surface / 10) * mult + rooms * 2);
    items.push({
      category: 'Electrical',
      label: 'Prises de courant 16A',
      quantity: prises,
      unitPrice: price('prise'),
      total: prises * price('prise'),
      icon: '🔌',
      priority: 'essentiel',
      trade: 'electricien',
    });

    const prisesDediees = Math.max(2, Math.ceil(rooms / 3));
    items.push({
      category: 'Electrical',
      label: 'Prises dédiées (clim, chauffe-eau, four)',
      quantity: prisesDediees,
      unitPrice: price('priseDediee'),
      total: prisesDediees * price('priseDediee'),
      icon: '❄️',
      priority: 'confort',
      trade: 'electricien',
    });

    const inter = Math.ceil(rooms * 1.5 * mult);
    items.push({
      category: 'Electrical',
      label: 'Interrupteurs et va-et-vient',
      quantity: inter,
      unitPrice: price('interrupteur'),
      total: inter * price('interrupteur'),
      icon: '🎚️',
      priority: 'essentiel',
      trade: 'electricien',
    });

    items.push({
      category: 'Electrical',
      label: 'Tableau électrique principal',
      quantity: 1,
      unitPrice: price('tableau'),
      total: price('tableau'),
      icon: '⚡',
      priority: 'essentiel',
      note: level === 'premium' ? 'Avec parafoudre et différentiels 30mA' : 'Avec protection de base',
      trade: 'electricien',
    });

    if (floors >= 2) {
      const tableauxDiv = floors - 1;
      items.push({
        category: 'Electrical',
        label: 'Tableaux divisionnaires par étage',
        quantity: tableauxDiv,
        unitPrice: price('tableauDivisionnaire'),
        total: tableauxDiv * price('tableauDivisionnaire'),
        icon: '⚡',
        priority: 'confort',
        note: `1 par niveau supérieur`,
        trade: 'electricien',
      });
    }

    if (level === 'premium') {
      items.push({
        category: 'Electrical',
        label: 'Parafoudre Type 2',
        quantity: 1,
        unitPrice: price('parafoudre'),
        total: price('parafoudre'),
        icon: '🛡️',
        priority: 'premium',
        trade: 'electricien',
      });
    }
  }

  // ==========================================================================
  //  ☀️ SOLAIRE
  // ==========================================================================
  if (domains.includes('solar') && getLevel('solar') !== 'none') {
    const level = getLevel('solar');

    const panneaux = Math.ceil((surface / 20) * mult);
    items.push({
      category: 'Solar Energy',
      label: 'Panneaux solaires 300W',
      quantity: panneaux,
      unitPrice: price('panneau300W'),
      total: panneaux * price('panneau300W'),
      icon: '☀️',
      priority: 'confort',
      note: `${(panneaux * 0.3).toFixed(1)} kWc estimé`,
      trade: 'solaire',
    });

    const batteries = level === 'premium' ? Math.ceil(surface / 60) : Math.ceil(surface / 100);
    items.push({
      category: 'Solar Energy',
      label: 'Batteries lithium 5 kWh',
      quantity: batteries,
      unitPrice: price('batterie5kWh'),
      total: batteries * price('batterie5kWh'),
      icon: '🔋',
      priority: level === 'premium' ? 'premium' : 'confort',
      note: `${batteries * 5} kWh d'autonomie`,
      trade: 'solaire',
    });

    const onduleurs = surface > 200 ? 2 : 1;
    items.push({
      category: 'Solar Energy',
      label: 'Onduleurs hybrides 3 kVA',
      quantity: onduleurs,
      unitPrice: price('onduleur3kVA'),
      total: onduleurs * price('onduleur3kVA'),
      icon: '⚙️',
      priority: 'essentiel',
      trade: 'solaire',
    });

    items.push({
      category: 'Solar Energy',
      label: 'Régulateur MPPT',
      quantity: 1,
      unitPrice: price('regulateurMPPT'),
      total: price('regulateurMPPT'),
      icon: '📊',
      priority: 'confort',
      trade: 'solaire',
    });
  }

  // ==========================================================================
  //  🌐 RÉSEAU
  // ==========================================================================
  if (domains.includes('network') && getLevel('network') !== 'none') {
    const level = getLevel('network');

    const rj45 = Math.ceil((surface / 20 + rooms) * mult * floorFactor);
    items.push({
      category: 'Networking',
      label: 'Prises réseau RJ45 Cat6',
      quantity: rj45,
      unitPrice: price('priseRJ45'),
      total: rj45 * price('priseRJ45'),
      icon: '🌐',
      priority: 'confort',
      trade: 'reseau',
    });

    const needsPoE = domains.includes('security') || level === 'premium' || surface > 150;
    if (needsPoE) {
      const switchPoE = surface > 300 ? 2 : 1;
      items.push({
        category: 'Networking',
        label: 'Switch PoE Gigabit (caméras/AP)',
        quantity: switchPoE,
        unitPrice: price('switchPoE'),
        total: switchPoE * price('switchPoE'),
        icon: '🔀',
        priority: 'essentiel',
        trade: 'reseau',
      });
    } else {
      items.push({
        category: 'Networking',
        label: 'Switch réseau Gigabit',
        quantity: 1,
        unitPrice: price('switch16ports'),
        total: price('switch16ports'),
        icon: '🔀',
        priority: 'confort',
        trade: 'reseau',
      });
    }

    const wifiAP = level === 'premium'
      ? Math.ceil((surface / 80) * floorFactor)
      : Math.ceil((surface / 150) * floorFactor);
    items.push({
      category: 'Networking',
      label: 'Points d\'accès Wi-Fi professionnels',
      quantity: wifiAP,
      unitPrice: price('wifiAP'),
      total: wifiAP * price('wifiAP'),
      icon: '📡',
      priority: level === 'premium' ? 'premium' : 'confort',
      trade: 'reseau',
    });

    if (level === 'premium' || surface > 150) {
      const baieKey = surface > 400 ? 'baie22U' : 'baie9U';
      items.push({
        category: 'Networking',
        label: `Baie de brassage ${surface > 400 ? '22U' : '9U'} équipée`,
        quantity: 1,
        unitPrice: price(baieKey),
        total: price(baieKey),
        icon: '🗄️',
        priority: 'premium',
        trade: 'reseau',
      });
    }
  }

  // ==========================================================================
  //  📹 SÉCURITÉ
  // ==========================================================================
  if (domains.includes('security') && getLevel('security') !== 'none') {
    const level = getLevel('security');

    const cameraRatio = level === 'premium' ? 30 : level === 'standard' ? 50 : 80;
    const cameras = Math.max(2, Math.ceil((surface / cameraRatio) * floorFactor));
    items.push({
      category: 'CCTV & Surveillance',
      label: 'Caméras IP HD',
      quantity: cameras,
      unitPrice: price('cameraIP'),
      total: cameras * price('cameraIP'),
      icon: '📹',
      priority: 'essentiel',
      note: `${cameras} zones couvertes`,
      trade: 'securite',
    });

    const nvrKey = cameras <= 8 ? 'nvr8ch' : 'nvr16ch';
    items.push({
      category: 'CCTV & Surveillance',
      label: `NVR ${cameras <= 8 ? '8' : '16'} canaux`,
      quantity: 1,
      unitPrice: price(nvrKey),
      total: price(nvrKey),
      icon: '🎬',
      priority: 'essentiel',
      trade: 'securite',
    });

    const disques = Math.ceil(cameras / 8);
    items.push({
      category: 'CCTV & Surveillance',
      label: 'Disques durs 1 To',
      quantity: disques,
      unitPrice: price('disque1To'),
      total: disques * price('disque1To'),
      icon: '💾',
      priority: 'essentiel',
      trade: 'securite',
    });

    if (level !== 'basic') {
      items.push({
        category: 'CCTV & Surveillance',
        label: 'Centrale d\'alarme avec détecteurs',
        quantity: 1,
        unitPrice: price('alarme'),
        total: price('alarme'),
        icon: '🚨',
        priority: 'confort',
        trade: 'securite',
      });
    }

    if (level === 'premium') {
      items.push({
        category: 'Access Control',
        label: 'Lecteurs de contrôle d\'accès',
        quantity: 2,
        unitPrice: price('lecteurAcces'),
        total: 2 * price('lecteurAcces'),
        icon: '🔐',
        priority: 'premium',
        trade: 'securite',
      });
      items.push({
        category: 'Access Control',
        label: 'Interphone vidéo',
        quantity: 1,
        unitPrice: price('interphone'),
        total: price('interphone'),
        icon: '📞',
        priority: 'premium',
        trade: 'securite',
      });
    }
  }

  // ==========================================================================
  //  🏠 DOMOTIQUE
  // ==========================================================================
  if (domains.includes('smart') && getLevel('smart') !== 'none') {
    const level = getLevel('smart');

    const modules = level === 'premium' ? rooms * 3 : level === 'standard' ? rooms * 2 : rooms;
    items.push({
      category: 'Smart Home',
      label: 'Modules domotiques (éclairage, prises)',
      quantity: modules,
      unitPrice: price('moduleDomotique'),
      total: modules * price('moduleDomotique'),
      icon: '🏠',
      priority: level === 'premium' ? 'premium' : 'confort',
      trade: 'domotique',
    });

    if (level !== 'basic') {
      const thermostats = Math.max(1, Math.ceil(rooms / 3));
      items.push({
        category: 'Smart Home',
        label: 'Thermostats intelligents',
        quantity: thermostats,
        unitPrice: price('thermostatIntelligent'),
        total: thermostats * price('thermostatIntelligent'),
        icon: '🌡️',
        priority: 'confort',
        trade: 'domotique',
      });
    }

    if (level === 'premium') {
      items.push({
        category: 'Smart Home',
        label: 'Passerelle domotique centralisée',
        quantity: 1,
        unitPrice: price('passerelleDomotique'),
        total: price('passerelleDomotique'),
        icon: '🧠',
        priority: 'premium',
        trade: 'domotique',
      });
    }
  }

  // ==========================================================================
  //  🚪 AUTOMATISATION (basé sur gateCount, pas sur surface)
  // ==========================================================================
  if (domains.includes('automation') && getLevel('automation') !== 'none') {
    const level = getLevel('automation');
    const gateCount = Math.max(1, input.gateCount ?? 1);
    const gateType = input.gateType ?? 'sliding';

    items.push({
      category: 'Automation',
      label: gateType === 'sliding'
        ? `Motorisation de portail coulissant`
        : `Motorisation de portail battant`,
      quantity: gateCount,
      unitPrice: price('motorisationPortail'),
      total: gateCount * price('motorisationPortail'),
      icon: '🚪',
      priority: 'essentiel',
      trade: 'automatisme',
    });

    if (level === 'premium') {
      items.push({
        category: 'Automation',
        label: 'Motorisation de porte de garage',
        quantity: 1,
        unitPrice: price('motorisationPorte'),
        total: price('motorisationPorte'),
        icon: '🏠',
        priority: 'premium',
        trade: 'automatisme',
      });
    }
  }

  // ==========================================================================
  //  🔥 CLÔTURE ÉLECTRIQUE (basé sur perimeter)
  // ==========================================================================
  if (domains.includes('fence') && getLevel('fence') !== 'none') {
    const perimeter = Math.max(10, input.perimeter ?? 50);
    items.push({
      category: 'Electric Fence',
      label: 'Câblage clôture électrique (m linéaire)',
      quantity: perimeter,
      unitPrice: price('clotureLineaire'),
      total: perimeter * price('clotureLineaire'),
      icon: '🔥',
      priority: 'essentiel',
      note: `${perimeter} m de périmètre`,
      trade: 'securite',
    });

    items.push({
      category: 'Electric Fence',
      label: 'Électrificateur de clôture',
      quantity: 1,
      unitPrice: price('energiseurCloture'),
      total: price('energiseurCloture'),
      icon: '⚡',
      priority: 'essentiel',
      trade: 'securite',
    });
  }

  // ==========================================================================
  //  🔧 MAINTENANCE / RÉNOVATION
  // ==========================================================================
  if (domains.includes('maintenance') && getLevel('maintenance') !== 'none') {
    items.push({
      category: 'Maintenance',
      label: 'Forfait diagnostic et audit',
      quantity: 1,
      unitPrice: price('forfaitDiagnostic'),
      total: price('forfaitDiagnostic'),
      icon: '🔍',
      priority: 'essentiel',
      trade: 'maintenance',
    });

    items.push({
      category: 'Maintenance',
      label: 'Forfait intervention / réparation',
      quantity: 1,
      unitPrice: price('forfaitIntervention'),
      total: price('forfaitIntervention'),
      icon: '🔧',
      priority: 'essentiel',
      trade: 'maintenance',
    });
  }

  // ==========================================================================
  //  CONSOMMABLES (câblage) — seulement si domaines concernés
  // ==========================================================================
  const hasElectrical = domains.includes('electrical');
  const hasNetwork = domains.includes('network');
  const hasSecurity = domains.includes('security');

  if (hasElectrical || hasNetwork || hasSecurity) {
    if (hasNetwork || hasSecurity) {
      const pointsNetwork =
        (hasNetwork ? Math.ceil(surface / 20) : 0) +
        (hasSecurity ? Math.ceil(surface / 50) * 3 : 0);
      const metresUTP = Math.round(pointsNetwork * 25 * floorFactor * complexity.materials);
      items.push({
        category: 'Accessories',
        label: 'Câble UTP Cat6',
        quantity: metresUTP,
        unitPrice: price('cableUTP'),
        total: metresUTP * price('cableUTP'),
        icon: '🔌',
        priority: 'essentiel',
        note: `${metresUTP} m`,
        isConsumable: true,
        trade: 'reseau',
      });
    }

    if (hasElectrical) {
      const metresElec = Math.round(surface * 3.5 * floorFactor * complexity.materials);
      items.push({
        category: 'Accessories',
        label: 'Câble électrique 3G2.5',
        quantity: metresElec,
        unitPrice: price('cableElec'),
        total: metresElec * price('cableElec'),
        icon: '⚡',
        priority: 'essentiel',
        note: `${metresElec} m`,
        isConsumable: true,
        trade: 'electricien',
      });

      const metresGaine = Math.round(metresElec * 0.8);
      items.push({
        category: 'Accessories',
        label: 'Gaine ICTA',
        quantity: metresGaine,
        unitPrice: price('gaineICTA'),
        total: metresGaine * price('gaineICTA'),
        icon: '🧵',
        priority: 'essentiel',
        isConsumable: true,
        trade: 'electricien',
      });

      const boites = Math.ceil(rooms * 2 + surface / 30);
      items.push({
        category: 'Accessories',
        label: 'Boîtes de dérivation',
        quantity: boites,
        unitPrice: price('boiteDerivation'),
        total: boites * price('boiteDerivation'),
        icon: '📦',
        priority: 'essentiel',
        isConsumable: true,
        trade: 'electricien',
      });
    }
  }

  // Quincaillerie (forfait 4%)
  const materialSubtotal = items.reduce((s, i) => s + i.total, 0);
  if (materialSubtotal > 0) {
    const quinc = Math.round(materialSubtotal * 0.04);
    items.push({
      category: 'Accessories',
      label: 'Quincaillerie (vis, chevilles, colliers)',
      quantity: 1,
      unitPrice: quinc,
      total: quinc,
      icon: '🔧',
      priority: 'essentiel',
      note: '≈ 4% du matériel brut',
      isConsumable: true,
    });
  }

  return items;
}

// ============================================================================
//  MAIN D'ŒUVRE
// ============================================================================
export function computeLabor(
  items: GeneratedItem[],
  input: ConfiguratorInput,
  customRates?: CustomLaborRates
) {
  const HOURS_PER_UNIT: Record<string, number> = {
    'prise': 0.5, 'priseDediee': 1.5, 'interrupteur': 0.4, 'pointLumineux': 0.6,
    'tableau': 8, 'tableauDivisionnaire': 4, 'parafoudre': 1,
    'panneau': 1.5, 'batterie': 2, 'onduleur': 4, 'regulateur': 1,
    'rj45': 0.5, 'switch': 1, 'switchPoE': 1.5, 'wifiAP': 2, 'baie': 6,
    'camera': 1.5, 'nvr': 3, 'disque': 0.5, 'alarme': 6, 'lecteur': 2, 'interphone': 2,
    'module': 0.5, 'thermostat': 1, 'passerelle': 4,
    'motorisation': 6, 'cloture': 0.1, 'energiseur': 3,
    'diagnostic': 4, 'intervention': 8,
    'cable': 0, 'gaine': 0, 'boite': 0.1, 'quincaillerie': 0,
  };

  const laborByTrade: Record<Trade, { hours: number; amount: number }> = {
    electricien: { hours: 0, amount: 0 },
    reseau: { hours: 0, amount: 0 },
    securite: { hours: 0, amount: 0 },
    domotique: { hours: 0, amount: 0 },
    solaire: { hours: 0, amount: 0 },
    automatisme: { hours: 0, amount: 0 },
    maintenance: { hours: 0, amount: 0 },
  };

  const complexity = COMPLEXITY_MULTIPLIERS[input.supportComplexity] ?? COMPLEXITY_MULTIPLIERS['neuf'];

  items.forEach((item) => {
    if (!item.trade || item.isConsumable) return;

    let hoursPerUnit = 0.5;
    const label = item.label.toLowerCase();
    for (const [key, h] of Object.entries(HOURS_PER_UNIT)) {
      if (label.includes(key.toLowerCase().slice(0, 6))) {
        hoursPerUnit = h;
        break;
      }
    }

    const totalHours = item.quantity * hoursPerUnit * complexity.labor;
    const rate = customRates?.[item.trade] ?? LABOR_RATES[item.trade];

    laborByTrade[item.trade].hours += totalHours;
    laborByTrade[item.trade].amount += totalHours * rate;
  });

  const totalHours = Object.values(laborByTrade).reduce((s, t) => s + t.hours, 0);
  const totalAmount = Object.values(laborByTrade).reduce((s, t) => s + t.amount, 0);

  return {
    byTrade: laborByTrade,
    totalHours: Math.round(totalHours),
    totalAmount: Math.round(totalAmount),
  };
}

// ============================================================================
//  TOTAUX
// ============================================================================
export function computeTotals(
  items: GeneratedItem[],
  input?: ConfiguratorInput,
  customRates?: CustomLaborRates
) {
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const essentials = items.filter((i) => i.priority === 'essentiel').reduce((s, i) => s + i.total, 0);
  const comfort = items.filter((i) => i.priority === 'confort').reduce((s, i) => s + i.total, 0);
  const premium = items.filter((i) => i.priority === 'premium').reduce((s, i) => s + i.total, 0);

  let labor = { totalAmount: Math.round(subtotal * 0.15), totalHours: 0, byTrade: {} as any };
  if (input) {
    labor = computeLabor(items, input, customRates) as any;
  }

  return {
    subtotal,
    count,
    essentials,
    comfort,
    premium,
    labor: labor.totalAmount,
    laborHours: labor.totalHours,
    laborByTrade: labor.byTrade,
    grandTotal: subtotal + labor.totalAmount,
  };
}