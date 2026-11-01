/* ================================================================== */
/*  LIB/PROJECTS.TS                                                    */
/* ================================================================== */

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
  status: 'en_cours' | 'termine' | string; // 👈 Le statut est bien là
  date: string;
  year: string;
  location: string;
  client: string;
  images: string[];
  shortDesc: string;
  challenge: string;
  solution: string;
  result: string;
  features: string[];
};

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  securite: 'Sécurité',
  solaire: 'Solaire',
  reseau: 'Réseau',
  domotique: 'Domotique',
  electricite: 'Électricité',
  automatisation: 'Automatisation',
  maintenance: 'Maintenance',
};

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

export const CATEGORY_ORDER: ProjectCategory[] = [
  'securite',
  'solaire',
  'reseau',
  'domotique',
  'electricite',
  'automatisation',
  'maintenance',
];