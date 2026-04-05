// data/products.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  salesCount: number;
  dateAdded: string;
  description: string;   // <-- champ ajouté
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Amplificateur GSM 100m',
    price: 95000,
    image: '/images/produits/1.webp',
    category: 'Outillage',
    salesCount: 120,
    dateAdded: '2024-03-15',
    description: 'Amplificateur GSM 100m, puissance 100mW, fréquence 900MHz. Idéale pour améliorer la couverture et la qualité de la communication dans les zones éloignées.',
  },
  {
    id: 2,
    name: 'Tournevis électrique',
    price: 49.99,
    image: '/images/produits/2.jpg',
    category: 'Outillage',
    salesCount: 85,
    dateAdded: '2024-03-20',
    description: 'Tournevis électrique 3.6V, 6 embouts interchangeables, batterie intégrée, lumière LED. Parfait pour l’électronique et le montage de meubles.',
  },
  {
    id: 3,
    name: 'Multimètre numérique',
    price: 34.99,
    image: '/images/produits/3.jpg',
    category: 'Mesure',
    salesCount: 45,
    dateAdded: '2024-03-25',
    description: 'Multimètre numérique avec affichage LCD, mesure de tension, courant, résistance, continuité. Idéal pour le diagnostic électrique.',
  },
  {
    id: 4,
    name: 'Niveau laser',
    price: 129.99,
    image: '/images/produits/4.jpg',
    category: 'Mesure',
    salesCount: 30,
    dateAdded: '2024-03-28',
    description: 'Niveau laser auto-nivelant, projection de lignes horizontales et verticales. Portée jusqu’à 30m, parfait pour le carrelage et l’alignement.',
  },
  {
    id: 5,
    name: 'Kit de clés à chocs',
    price: 79.99,
    image: '/images/produits/5.jpg',
    category: 'Outillage',
    salesCount: 60,
    dateAdded: '2024-04-01',
    description: 'Kit de 8 clés à chocs en acier chromé, résistantes à l’huile et aux chocs. Idéal pour les mécaniciens et bricoleurs exigeants.',
  },
  {
    id: 6,
    name: 'Caméra thermique',
    price: 299.99,
    image: '/images/produits/6.jpg',
    category: 'Inspection',
    salesCount: 12,
    dateAdded: '2024-04-05',
    description: 'Caméra thermique compacte, résolution 160x120, plage de mesure -20°C à 400°C. Détecte les fuites d’air, les défauts d’isolation, les surchauffes.',
  },
];