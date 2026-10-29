/* ================================================================== */
/*  LIB/PRODUCTS.TS                                                    */
/*  Données d'exemple pour le carrousel de la page d'accueil.          */
/*  ⚠️ À remplacer plus tard par un fetch vers ta vraie base Turso.     */
/* ================================================================== */

export type HomeProduct = {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string; // Optionnel, pour afficher le prix barré
  image: string;
  badge?: string; // Ex: "-20%", "Best Seller"
  inStock: boolean;
};

export const FEATURED_PRODUCTS: HomeProduct[] = [
  {
    id: 1,
    name: 'Switch PoE 16 ports',
    category: 'Network IT',
    price: '60 000 FCFA',
    oldPrice: '75 000 FCFA',
    image: '/images/products/switch.jpg', 
    badge: '-20%',
    inStock: true,
  },
  {
    id: 2,
    name: 'Caméra IP Hikvision 4K',
    category: 'Sécurité',
    price: '85 000 FCFA',
    image: '/images/products/camera.jpg',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 3,
    name: 'Onduleur hybride 5kVA',
    category: 'Solaire',
    price: '350 000 FCFA',
    image: '/images/products/inverter.jpg',
    inStock: true,
  },
  {
    id: 4,
    name: 'Kit Domotique Zigbee',
    category: 'Domotique',
    price: '45 000 FCFA',
    image: '/images/products/domotique.jpg',
    badge: 'Nouveau',
    inStock: true,
  },
  {
    id: 5,
    name: 'Panneau Solaire 450Wc',
    category: 'Solaire',
    price: '95 000 FCFA',
    image: '/images/products/panneau.jpg',
    inStock: true,
  },
];