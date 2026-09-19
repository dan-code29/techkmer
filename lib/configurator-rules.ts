// ============================================================================
//  RÈGLES DU CONFIGURATEUR — Détermine les équipements selon le projet
// ============================================================================

export type ProjectType = 'maison' | 'appartement' | 'bureau' | 'commerce' | 'entrepot';

export type EquipLevel = 'none' | 'basic' | 'standard' | 'premium';

export type ConfiguratorInput = {
  projectType: ProjectType;
  surface: number;          // m²
  rooms: number;            // nombre de pièces principales
  electrical: EquipLevel;
  solar: EquipLevel;
  network: EquipLevel;
  security: EquipLevel;
  smart: EquipLevel;
  automation: EquipLevel;
};

// ----------------------------------------------------------------------------
//  Ratios par type de projet (multiplicateurs)
// ----------------------------------------------------------------------------
export const PROJECT_MULTIPLIERS: Record<ProjectType, number> = {
  appartement: 0.9,
  maison: 1.0,
  bureau: 1.4,
  commerce: 1.6,
  entrepot: 1.2,
};

// ----------------------------------------------------------------------------
//  Type de ligne générée
// ----------------------------------------------------------------------------
export type GeneratedItem = {
  category: string;         // Catégorie produit (doit matcher la BDD)
  label: string;            // Libellé pour l'utilisateur
  quantity: number;         // Quantité suggérée
  unitPrice: number;        // Prix unitaire estimé (FCFA)
  total: number;            // quantity * unitPrice
  icon: string;             // Emoji pour affichage
  priority: 'essentiel' | 'confort' | 'premium';
  note?: string;            // Note d'explication
};

// ----------------------------------------------------------------------------
//  Prix moyens indicatifs par unité (FCFA)
//  Modifiez ces valeurs selon vos vrais tarifs
// ----------------------------------------------------------------------------
const UNIT_PRICES = {
  // Électricité
  prise: 5000,
  interrupteur: 3500,
  tableau: 150000,
  pointLumineux: 8000,
  // Solaire
  panneau300W: 45000,
  batterie5kWh: 250000,
  onduleur3kVA: 180000,
  // Réseau
  priseRJ45: 8000,
  switch16ports: 45000,
  routeurPro: 55000,
  wifiAP: 35000,
  baie9U: 45000,
  // Sécurité
  cameraIP: 25000,
  nvr8ch: 50000,
  alarme: 85000,
  lecteurAcces: 35000,
  // Domotique
  moduleDomotique: 25000,
  thermostatIntelligent: 45000,
  // Automatisation
  motorisationPortail: 350000,
};

// ----------------------------------------------------------------------------
//  GÉNÉRATEUR PRINCIPAL
//  Prend les inputs du client et retourne la liste des équipements suggérés
// ----------------------------------------------------------------------------
export function generateEquipmentList(input: ConfiguratorInput): GeneratedItem[] {
  const items: GeneratedItem[] = [];
  const mult = PROJECT_MULTIPLIERS[input.projectType];
  const surface = input.surface;
  const rooms = input.rooms;

  // ==========================================================================
  //  ⚡ ÉLECTRICITÉ
  // ==========================================================================
  if (input.electrical !== 'none') {
    // Nombre de points lumineux : 1 par 15 m²
    const lumineux = Math.ceil((surface / 15) * mult);
    items.push({
      category: 'Electrical',
      label: 'Points lumineux (plafonniers, spots)',
      quantity: lumineux,
      unitPrice: UNIT_PRICES.pointLumineux,
      total: lumineux * UNIT_PRICES.pointLumineux,
      icon: '💡',
      priority: 'essentiel',
      note: 'Éclairage réparti selon la surface',
    });

    // Prise de courant : 1 par 10 m² + 2 par pièce
    const prises = Math.ceil((surface / 10) * mult + rooms * 2);
    items.push({
      category: 'Electrical',
      label: 'Prises de courant 16A',
      quantity: prises,
      unitPrice: UNIT_PRICES.prise,
      total: prises * UNIT_PRICES.prise,
      icon: '🔌',
      priority: 'essentiel',
    });

    // Interrupteurs : 1 par pièce
    const inter = Math.ceil(rooms * 1.5 * mult);
    items.push({
      category: 'Electrical',
      label: 'Interrupteurs et va-et-vient',
      quantity: inter,
      unitPrice: UNIT_PRICES.interrupteur,
      total: inter * UNIT_PRICES.interrupteur,
      icon: '🎚️',
      priority: 'essentiel',
    });

    // Tableau électrique
    const tableaux = input.electrical === 'premium' ? 2 : 1;
    items.push({
      category: 'Electrical',
      label: 'Tableau électrique divisionnaire',
      quantity: tableaux,
      unitPrice: UNIT_PRICES.tableau,
      total: tableaux * UNIT_PRICES.tableau,
      icon: '⚡',
      priority: input.electrical === 'premium' ? 'premium' : 'essentiel',
      note: input.electrical === 'premium' ? 'Avec parafoudre et différentiels 30mA' : 'Avec protection de base',
    });
  }

  // ==========================================================================
  //  ☀️ ÉNERGIE SOLAIRE
  // ==========================================================================
  if (input.solar !== 'none') {
    // Ratio : 1 panneau 300W par 20 m²
    const panneaux = Math.ceil((surface / 20) * mult);
    items.push({
      category: 'Solar Energy',
      label: 'Panneaux solaires 300W',
      quantity: panneaux,
      unitPrice: UNIT_PRICES.panneau300W,
      total: panneaux * UNIT_PRICES.panneau300W,
      icon: '☀️',
      priority: 'confort',
      note: `${(panneaux * 0.3).toFixed(1)} kWc estimé`,
    });

    // Batteries
    const batteries = input.solar === 'premium' ? Math.ceil(surface / 60) : Math.ceil(surface / 100);
    items.push({
      category: 'Solar Energy',
      label: 'Batteries lithium 5 kWh',
      quantity: batteries,
      unitPrice: UNIT_PRICES.batterie5kWh,
      total: batteries * UNIT_PRICES.batterie5kWh,
      icon: '🔋',
      priority: input.solar === 'premium' ? 'premium' : 'confort',
      note: `${batteries * 5} kWh d'autonomie`,
    });

    // Onduleurs
    const onduleurs = surface > 200 ? 2 : 1;
    items.push({
      category: 'Solar Energy',
      label: 'Onduleurs hybrides 3 kVA',
      quantity: onduleurs,
      unitPrice: UNIT_PRICES.onduleur3kVA,
      total: onduleurs * UNIT_PRICES.onduleur3kVA,
      icon: '⚙️',
      priority: 'essentiel',
    });
  }

  // ==========================================================================
  //  🌐 RÉSEAU
  // ==========================================================================
  if (input.network !== 'none') {
    // Prises RJ45 : 1 par 20 m² + 1 par pièce pour bureau
    const rj45 = Math.ceil((surface / 20 + rooms) * mult);
    items.push({
      category: 'Networking',
      label: 'Prises réseau RJ45 Cat6',
      quantity: rj45,
      unitPrice: UNIT_PRICES.priseRJ45,
      total: rj45 * UNIT_PRICES.priseRJ45,
      icon: '🌐',
      priority: 'confort',
    });

    // Switch
    const switchPorts = surface > 200 ? '16 ports' : '8 ports';
    items.push({
      category: 'Networking',
      label: `Switch réseau ${switchPorts} Gigabit`,
      quantity: 1,
      unitPrice: UNIT_PRICES.switch16ports,
      total: UNIT_PRICES.switch16ports,
      icon: '🔀',
      priority: 'confort',
    });

    // Wi-Fi
    const wifiAP = input.network === 'premium' ? Math.ceil(surface / 80) : Math.ceil(surface / 150);
    items.push({
      category: 'Networking',
      label: 'Points d\'accès Wi-Fi professionnels',
      quantity: wifiAP,
      unitPrice: UNIT_PRICES.wifiAP,
      total: wifiAP * UNIT_PRICES.wifiAP,
      icon: '📡',
      priority: input.network === 'premium' ? 'premium' : 'confort',
    });

    // Baie de brassage
    if (input.network === 'premium' || surface > 150) {
      items.push({
        category: 'Networking',
        label: 'Baie de brassage 9U équipée',
        quantity: 1,
        unitPrice: UNIT_PRICES.baie9U,
        total: UNIT_PRICES.baie9U,
        icon: '🗄️',
        priority: 'premium',
      });
    }
  }

  // ==========================================================================
  //  📹 SÉCURITÉ
  // ==========================================================================
  if (input.security !== 'none') {
    // Caméras : 1 par 80 m² en basic, 1 par 50 m² en standard, 1 par 30 m² en premium
    const cameraRatio = input.security === 'premium' ? 30 : input.security === 'standard' ? 50 : 80;
    const cameras = Math.max(2, Math.ceil(surface / cameraRatio));
    items.push({
      category: 'CCTV & Surveillance',
      label: 'Caméras IP HD',
      quantity: cameras,
      unitPrice: UNIT_PRICES.cameraIP,
      total: cameras * UNIT_PRICES.cameraIP,
      icon: '📹',
      priority: 'essentiel',
      note: `Couverture ${cameras} zones`,
    });

    // NVR
    const nvrCh = cameras <= 4 ? '4 canaux' : cameras <= 8 ? '8 canaux' : '16 canaux';
    items.push({
      category: 'CCTV & Surveillance',
      label: `NVR ${nvrCh} avec stockage 1 To`,
      quantity: 1,
      unitPrice: UNIT_PRICES.nvr8ch,
      total: UNIT_PRICES.nvr8ch,
      icon: '🎬',
      priority: 'essentiel',
    });

    // Alarme
    if (input.security !== 'basic') {
      items.push({
        category: 'CCTV & Surveillance',
        label: 'Centrale d\'alarme avec détecteurs',
        quantity: 1,
        unitPrice: UNIT_PRICES.alarme,
        total: UNIT_PRICES.alarme,
        icon: '🚨',
        priority: 'confort',
      });
    }

    // Contrôle d'accès
    if (input.security === 'premium') {
      items.push({
        category: 'Access Control',
        label: 'Lecteurs de contrôle d\'accès',
        quantity: 2,
        unitPrice: UNIT_PRICES.lecteurAcces,
        total: 2 * UNIT_PRICES.lecteurAcces,
        icon: '🔐',
        priority: 'premium',
      });
    }
  }

  // ==========================================================================
  //  🏠 DOMOTIQUE
  // ==========================================================================
  if (input.smart !== 'none') {
    // Modules domotiques : 1 par pièce
    const modules = input.smart === 'premium' ? rooms * 3 : input.smart === 'standard' ? rooms * 2 : rooms;
    items.push({
      category: 'Smart Home',
      label: 'Modules domotiques (éclairage, prises)',
      quantity: modules,
      unitPrice: UNIT_PRICES.moduleDomotique,
      total: modules * UNIT_PRICES.moduleDomotique,
      icon: '🏠',
      priority: input.smart === 'premium' ? 'premium' : 'confort',
    });

    // Thermostats intelligents
    if (input.smart !== 'basic') {
      items.push({
        category: 'Smart Home',
        label: 'Thermostats intelligents',
        quantity: Math.max(1, Math.ceil(rooms / 3)),
        unitPrice: UNIT_PRICES.thermostatIntelligent,
        total: Math.max(1, Math.ceil(rooms / 3)) * UNIT_PRICES.thermostatIntelligent,
        icon: '🌡️',
        priority: 'confort',
      });
    }
  }

  // ==========================================================================
  //  🚪 AUTOMATISATION
  // ==========================================================================
  if (input.automation !== 'none') {
    const portails = input.automation === 'premium' ? 2 : 1;
    items.push({
      category: 'Automation',
      label: 'Motorisation de portail coulissant',
      quantity: portails,
      unitPrice: UNIT_PRICES.motorisationPortail,
      total: portails * UNIT_PRICES.motorisationPortail,
      icon: '🚪',
      priority: 'confort',
    });
  }

  return items;
}

// ----------------------------------------------------------------------------
//  Calcul du total et des statistiques
// ----------------------------------------------------------------------------
export function computeTotals(items: GeneratedItem[]) {
  const total = items.reduce((sum, i) => sum + i.total, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const essentials = items.filter((i) => i.priority === 'essentiel').reduce((s, i) => s + i.total, 0);
  const comfort = items.filter((i) => i.priority === 'confort').reduce((s, i) => s + i.total, 0);
  const premium = items.filter((i) => i.priority === 'premium').reduce((s, i) => s + i.total, 0);

  // Estimation main d'œuvre (15%)
  const labor = Math.round(total * 0.15);

  return {
    subtotal: total,
    labor,
    grandTotal: total + labor,
    count,
    essentials,
    comfort,
    premium,
  };
}