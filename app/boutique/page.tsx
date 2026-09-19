'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import {
  FaTruck, FaMoneyBillWave, FaShieldAlt, FaHeadset, FaUndo,
  FaChevronLeft, FaChevronRight, FaBolt, FaNetworkWired, FaHome,
  FaDoorOpen, FaVideo, FaLock, FaSun, FaBox, FaCog,
  FaFire, FaStar, FaClock, FaBars, FaSearch, FaTimes,
  FaFilter, FaTh, FaList, FaHeart, FaEye, FaCheckCircle,
  FaPlug,
} from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  salesCount: number;
  isPromotion: number;
  dateAdded?: string;
  description?: string;
};

type CategoryDef = {
  id: string;       // Identifiant normalisé (anglais)
  label: string;    // Libellé affiché
  icon: any;        // Icône react-icons
};

// ============================================================================
//  CATÉGORIES FIXES (toujours affichées, même sans produits)
// ============================================================================
const ALL_CATEGORIES: CategoryDef[] = [
  { id: 'Electrical', label: 'Electrical', icon: FaBolt },
  { id: 'Solar Energy', label: 'Solar Energy', icon: FaSun },
  { id: 'Networking', label: 'Networking', icon: FaNetworkWired },
  { id: 'Smart Home', label: 'Smart Home', icon: FaHome },
  { id: 'CCTV & Surveillance', label: 'CCTV & Surveillance', icon: FaVideo },
  { id: 'Access Control', label: 'Access Control', icon: FaLock },
  { id: 'Automation', label: 'Automation', icon: FaDoorOpen },
  { id: 'Electric Fence', label: 'Electric Fence', icon: FaPlug },
  { id: 'Accessories', label: 'Accessories', icon: FaCog },
];

// ============================================================================
//  FONCTION DE MATCHING : associe une catégorie API à un ID normalisé
//  Ex: "electric fence" → "Electric Fence", "network IT" → "Networking"
// ============================================================================
function matchCategory(apiCategory: string): string {
  // Si c'est déjà un ID exact, on le retourne directement
  if (ALL_CATEGORIES.some((c) => c.id === apiCategory)) {
    return apiCategory;
  }

  const lower = apiCategory.toLowerCase();

  // Electric Fence (avant Electrical car contient "electric")
  if (lower.includes('electric') && lower.includes('fence')) return 'Electric Fence';
  if (lower.includes('clôture') || lower.includes('cloture')) return 'Electric Fence';

  if (lower.includes('electric') || lower.includes('électricité')) return 'Electrical';
  if (lower.includes('solar') || lower.includes('solaire')) return 'Solar Energy';
  if (lower.includes('network') || lower.includes('réseau') || lower.includes('reseau') || lower.includes('network it')) return 'Networking';
  if (lower.includes('smart') || lower.includes('domotique')) return 'Smart Home';
  if (lower.includes('cctv') || lower.includes('vidéo') || lower.includes('video') || lower.includes('surveillance')) return 'CCTV & Surveillance';
  if (lower.includes('sécurité') || lower.includes('securite')) return 'CCTV & Surveillance';
  if (lower.includes('access') && lower.includes('control')) return 'Access Control';
  if (lower.includes('accès') || lower.includes('controle')) return 'Access Control';
  if (lower.includes('automation') || lower.includes('automatisme') || lower.includes('portail')) return 'Automation';
  if (lower.includes('accessoire') || lower.includes('outil') || lower.includes('câble') || lower.includes('cable') || lower.includes('mesure') || lower.includes('inspection')) return 'Accessories';

  return apiCategory;
}

// ============================================================================
//  DONNÉES STATIQUES
// ============================================================================
const TRUST_BADGES = [
  { icon: FaTruck, title: 'Livraison rapide', sub: 'Douala & Yaoundé' },
  { icon: FaMoneyBillWave, title: 'Paiement à la livraison', sub: 'Cash ou Mobile Money' },
  { icon: FaShieldAlt, title: '100% authentiques', sub: 'Garantie 12 mois' },
  { icon: FaHeadset, title: 'Service après-vente', sub: 'Assistance dédiée' },
  { icon: FaUndo, title: 'Retour gratuit', sub: 'Sous 7 jours' },
];

const BRANDS = [
  'Schneider Electric', 'Legrand', 'Hikvision', 'Dahua', 'TP-Link',
  'Ubiquiti', 'Shelly', 'Sonoff', 'ABB', 'Siemens',
  'Philips', 'Bosch', 'Eaton', 'Gewiss', 'Gira', 'Lutron',
];

// ============================================================================
//  COMPOSANT : COMPTE À REBOURS (Ventes Flash)
// ============================================================================
function CountdownTimer() {
  const [time, setTime] = useState({ d: 0, h: 23, m: 59, s: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = 0; h = 23; m = 59; s = 59; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {[
        { v: time.d, l: 'J' },
        { v: time.h, l: 'H' },
        { v: time.m, l: 'M' },
        { v: time.s, l: 'S' },
      ].map((x, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="bg-white text-[#050B16] font-bold rounded w-8 h-8 flex items-center justify-center text-sm shadow">
            {String(x.v).padStart(2, '0')}
          </div>
          <span className="text-white text-[10px] font-medium">{x.l}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
//  COMPOSANT : CARTE PRODUIT
// ============================================================================
function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Gestion de l'image avec fallback
  const imageSrc =
    product.image && typeof product.image === 'string'
      ? product.image
      : '/images/placeholder.jpg';

  const isPromo = product.isPromotion === 1;
  const discount = isPromo ? 20 : 0;
  const oldPrice = isPromo ? Math.round(product.price / 0.8) : 0;
  const isTop = product.salesCount > 50;

  return (
    <div className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col relative">
      {/* Badges (promo + top) */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isPromo && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
            -{discount}%
          </span>
        )}
        {isTop && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
            🔥 TOP
          </span>
        )}
      </div>

      {/* Bouton wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
        aria-label="Favori"
      >
        <FaHeart size={11} className={isWishlisted ? 'text-red-500' : 'text-gray-300'} />
      </button>

      {/* Image */}
      <Link href={`/produit/${product.id}`} className="relative h-40 bg-gray-50 block">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain p-3 group-hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Contenu */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[9px] text-[#00C2FF] font-bold uppercase tracking-widest mb-1 truncate">
          {product.category}
        </p>

        <Link href={`/produit/${product.id}`}>
          <h3 className="text-sm font-semibold text-[#050B16] line-clamp-2 leading-snug mb-2 min-h-[36px] hover:text-[#0066FF] transition">
            {product.name}
          </h3>
        </Link>

        {/* Étoiles */}
        <div className="flex items-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar key={s} size={9} className="text-amber-400" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">
            ({Math.round(product.salesCount / 10)})
          </span>
        </div>

        {/* Prix + bouton */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <p className="text-emerald-600 font-bold text-base">
              {formatPrice(product.price)}
            </p>
            {isPromo && (
              <p className="text-gray-400 text-xs line-through">
                {formatPrice(oldPrice)}
              </p>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-bold text-xs uppercase tracking-wide transition flex items-center justify-center gap-2"
          >
            <FaBolt size={10} /> Acheter
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  COMPOSANT : LIGNE HORIZONTALE DE PRODUITS (Best Sellers, Nouveautés…)
// ============================================================================
function ProductRow({
  title,
  subtitle,
  products,
  onAddToCart,
  onViewMore,
  icon,
  bgColor,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart: (p: Product) => void;
  onViewMore?: () => void;
  icon?: string;
  bgColor?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className={`${bgColor || ''} flex items-center justify-between mb-4 ${bgColor ? 'rounded-lg px-4 py-3' : ''}`}>
        <div>
          <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${bgColor ? 'text-white' : 'text-[#050B16]'}`}>
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xs mt-0.5 ${bgColor ? 'text-white/80' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onViewMore}
          className={`text-xs font-bold px-4 py-2 rounded transition ${
            bgColor
              ? 'bg-white text-emerald-700 hover:bg-emerald-50'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          Voir plus
        </button>
      </div>

      <div className="relative">
        <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-[#050B16] hover:bg-[#0066FF] hover:text-white transition" aria-label="Précédent">
          <FaChevronLeft size={14} />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((p) => (
            <div key={p.id} className="min-w-[220px] max-w-[220px] shrink-0">
              <ProductCard product={p} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-[#050B16] hover:bg-[#0066FF] hover:text-white transition" aria-label="Suivant">
          <FaChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}

// ============================================================================
//  COMPOSANT : HERO BANNER (carrousel)
// ============================================================================
function HeroBanner() {
  const slides = [
    { badge: 'Smart Home', title: 'Maison connectée,\nvie simplifiée', desc: 'Éclairage intelligent, scénarios, contrôle à distance.', cta: 'Explorer la domotique', href: '#all-products', bg: 'from-indigo-900 via-purple-800 to-blue-700' },
    { badge: 'Sécurité', title: 'Protégez ce qui\ncompte vraiment', desc: "Vidéosurveillance, alarmes, contrôle d'accès.", cta: 'Voir la sécurité', href: '#all-products', bg: 'from-red-900 via-rose-800 to-red-700' },
    { badge: 'Énergie solaire', title: 'Autonomie\nénergétique', desc: 'Panneaux, batteries, onduleurs — installation incluse.', cta: 'Kits solaires', href: '#all-products', bg: 'from-amber-800 via-orange-700 to-yellow-600' },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div className={`relative h-[300px] md:h-[420px] rounded-lg overflow-hidden bg-gradient-to-br ${slide.bg}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 max-w-md">
        <span className="inline-block bg-[#00C2FF] text-[#050B16] text-[10px] font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-widest">
          {slide.badge}
        </span>
        <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 whitespace-pre-line leading-tight">{slide.title}</h2>
        <p className="text-gray-200 text-sm md:text-base mb-6 max-w-sm">{slide.desc}</p>
        <a href={slide.href} className="bg-white text-[#050B16] font-bold px-6 py-3 rounded-full w-fit hover:bg-[#00C2FF] hover:text-white transition shadow-lg text-sm">{slide.cta}</a>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition" aria-label="Précédent">
        <FaChevronLeft size={12} />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition" aria-label="Suivant">
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}

// ============================================================================
//  COMPOSANT PRINCIPAL : CONTENU DE LA BOUTIQUE
// ============================================================================
function BoutiqueContent() {
  const { addItem } = useCart();
  const searchParams = useSearchParams();

  // Récupération des paramètres URL
  const initialCat = searchParams.get('cat') || 'all';
  const initialQ = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || '';

  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [sortOption, setSortOption] = useState<string>(initialFilter === 'best' ? 'best-seller' : 'default');
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [showAlert, setShowAlert] = useState(false);
  const [lastProduct, setLastProduct] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Ref pour scroller vers la grille produits
  const allProductsRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  //  Chargement des produits depuis l'API
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((prods) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // -------------------------------------------------------------------------
  //  AUTO-SCROLL : quand on arrive avec des params URL (depuis navbar)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (initialCat !== 'all' || initialQ || initialFilter) {
      const timer = setTimeout(() => {
        allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialCat, initialQ, initialFilter]);

  // -------------------------------------------------------------------------
  //  Scroll vers la grille produits (utilisé par les boutons)
  // -------------------------------------------------------------------------
  const scrollToAllProducts = () => {
    setTimeout(() => {
      allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // -------------------------------------------------------------------------
  //  Gestion clic sur une catégorie → filtre + scroll
  // -------------------------------------------------------------------------
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    scrollToAllProducts();
  };

  // -------------------------------------------------------------------------
  //  Filtrage et tri des produits
  // -------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtre par catégorie (via matchCategory pour normaliser)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => matchCategory(p.category) === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Filtres URL spéciaux
    if (initialFilter === 'promo') {
      filtered = filtered.filter((p) => p.isPromotion === 1);
    } else if (initialFilter === 'best') {
      filtered = filtered.filter((p) => p.salesCount > 50);
    }

    // Tri
    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'best-seller': filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)); break;
      case 'newest': filtered.sort((a, b) => {
        const da = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const db = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return db - da;
      }); break;
      default: break;
    }

    return filtered;
  }, [products, selectedCategory, sortOption, searchQuery, initialFilter]);

  // -------------------------------------------------------------------------
  //  Sélections spéciales (Flash, Best, Nouveautés)
  // -------------------------------------------------------------------------
  const flashSales = useMemo(() => products.filter((p) => p.isPromotion === 1).slice(0, 10), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 10), [products]);
  const newArrivals = useMemo(() => [...products].sort((a, b) => {
    const da = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
    const db = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
    return db - da;
  }).slice(0, 10), [products]);

  const visibleProducts = filteredProducts.slice(0, itemsPerPage);

  // Compteur par catégorie (pour affichage dans la sidebar)
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CATEGORIES.forEach((cat) => {
      counts[cat.id] = products.filter((p) => matchCategory(p.category) === cat.id).length;
    });
    return counts;
  }, [products]);

  // -------------------------------------------------------------------------
  //  Ajout au panier
  // -------------------------------------------------------------------------
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/images/placeholder.jpg',
    });
    setLastProduct(product.name);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Alerte ajout panier */}
      {showAlert && (
        <div className="fixed top-24 right-4 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-3">
          <FaCheckCircle size={16} />
          <span className="text-sm font-semibold"><strong>{lastProduct}</strong> ajouté au panier !</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">

        {/* =================================================================
            SECTION 1 : HERO + SIDEBAR + 2 BANNIÈRES
        ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">

          {/* ---- SIDEBAR CATÉGORIES ---- */}
          <aside className="lg:col-span-3 bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#050B16] to-[#0a1a3a] text-white px-4 py-3">
              <p className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <FaBars size={12} /> Catégories
              </p>
            </div>
            <ul className="py-1 max-h-[420px] overflow-y-auto">
              {/* Bouton "Tous les produits" */}
              <li>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#00C2FF]/10 text-[#0066FF] font-semibold border-l-4 border-[#0066FF]'
                      : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FaBox size={12} className="text-[#00C2FF]" />
                    Tous les produits
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{products.length}</span>
                </button>
              </li>
              {/* Catégories fixes */}
              {ALL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const count = countByCategory[cat.id] || 0;
                const active = selectedCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                        active
                          ? 'bg-[#00C2FF]/10 text-[#0066FF] font-semibold border-l-4 border-[#0066FF]'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon size={12} className="text-[#00C2FF] shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 shrink-0">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ---- HERO BANNER ---- */}
          <div className="lg:col-span-6">
            <HeroBanner />
          </div>

          {/* ---- 2 BANNIÈRES LATÉRALES ---- */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <a href="#all-products" className="rounded-lg p-5 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex flex-col justify-between h-[150px] lg:h-[200px] shadow-md hover:shadow-lg transition group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🛠️</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-90">Services pro</p>
                <p className="font-bold text-base leading-tight mt-1">Devis gratuit<br />en 24h</p>
              </div>
            </a>
            <a href="#all-products" className="rounded-lg p-5 bg-gradient-to-br from-red-600 to-orange-500 text-white flex flex-col justify-between h-[150px] lg:h-[200px] shadow-md hover:shadow-lg transition group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🔥</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-90">Offre flash</p>
                <p className="font-bold text-base leading-tight mt-1">Jusqu&apos;à -50%<br />sur les kits</p>
              </div>
            </a>
          </div>
        </div>

        {/* =================================================================
            SECTION 2 : BADGES DE CONFIANCE
        ================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-3 hover:border-emerald-500 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#050B16] truncate">{badge.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================================
            SECTION 3 : VENTES FLASH
        ================================================================= */}
        {flashSales.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaFire className="text-white" size={22} />
                <div>
                  <p className="text-white font-bold text-lg leading-tight">Ventes Flash</p>
                  <p className="text-emerald-100 text-xs">Chaque semaine — ne les ratez pas !</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-xs font-medium hidden md:inline">Termine dans :</span>
                <CountdownTimer />
                <button onClick={() => { setSelectedCategory('all'); scrollToAllProducts(); }} className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded hover:bg-emerald-50 transition">
                  Voir plus
                </button>
              </div>
            </div>
            <ProductRow
              title=""
              products={flashSales}
              onAddToCart={handleAddToCart}
              onViewMore={() => { setSelectedCategory('all'); scrollToAllProducts(); }}
            />
          </>
        )}

        {/* =================================================================
            SECTION 4 : BEST SELLERS
        ================================================================= */}
        {bestSellers.length > 0 && (
          <ProductRow
            title="Les plus vendus"
            subtitle="Les produits préférés de nos clients"
            products={bestSellers}
            onAddToCart={handleAddToCart}
            onViewMore={() => { setSelectedCategory('all'); setSortOption('best-seller'); scrollToAllProducts(); }}
            icon="⭐"
          />
        )}

        {/* =================================================================
            SECTION 5 : TOUS LES PRODUITS (avec ref pour scroll auto)
        ================================================================= */}
        <section ref={allProductsRef} id="all-products" className="bg-white rounded-lg border border-gray-100 p-6 mb-8 scroll-mt-24">
          {/* En-tête */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#050B16]">
                {selectedCategory === 'all' ? 'Tous nos produits' : selectedCategory}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Recherche inline */}
            <div className="relative flex-1 max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher…"
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:inline">
                <FaFilter size={11} className="inline mr-1" /> Trier :
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="default">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="best-seller">Meilleures ventes</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>

            {/* Toggle grille/liste */}
            <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`w-8 h-8 rounded flex items-center justify-center transition ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Grille">
                <FaTh size={12} />
              </button>
              <button onClick={() => setViewMode('list')} className={`w-8 h-8 rounded flex items-center justify-center transition ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Liste">
                <FaList size={12} />
              </button>
            </div>
          </div>

          {/* Filtres actifs */}
          {(selectedCategory !== 'all' || searchQuery || initialFilter) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500"><FaTimes size={9} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  « {searchQuery} »
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><FaTimes size={9} /></button>
                </span>
              )}
              {initialFilter === 'promo' && (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">🔥 Promotions</span>
              )}
              {initialFilter === 'best' && (
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">⭐ Best Sellers</span>
              )}
              <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSortOption('default'); }} className="text-xs font-semibold text-red-500 hover:underline">
                Tout effacer
              </button>
            </div>
          )}

          {/* Grille produits OU message vide */}
          {visibleProducts.length === 0 ? (
            <div className="text-center py-16">
              <FaBox className="text-gray-300 mx-auto mb-3" size={40} />
              <p className="text-gray-500 font-semibold">Aucun produit dans cette catégorie</p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedCategory !== 'all'
                  ? `Les produits "${selectedCategory}" seront bientôt disponibles.`
                  : 'Essayez un autre filtre ou mot-clé.'}
              </p>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition">
                  Voir tous les produits
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}

          {/* Bouton Voir plus */}
          {itemsPerPage < filteredProducts.length && (
            <div className="text-center mt-8">
              <button onClick={() => setItemsPerPage(itemsPerPage + 20)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-lg text-sm transition">
                Voir plus ({filteredProducts.length - itemsPerPage} restants)
              </button>
            </div>
          )}
        </section>

        {/* =================================================================
            SECTION 6 : NOUVEAUTÉS
        ================================================================= */}
        {newArrivals.length > 0 && (
          <ProductRow
            title="Nouveautés"
            subtitle="Les derniers ajouts à notre catalogue"
            products={newArrivals}
            onAddToCart={handleAddToCart}
            onViewMore={() => { setSelectedCategory('all'); setSortOption('newest'); scrollToAllProducts(); }}
            icon="✨"
          />
        )}

        {/* =================================================================
            SECTION 7 : CTA DEMANDE CONSEIL
        ================================================================= */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#fff,transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex-1 min-w-[280px]">
              <p className="text-white/90 text-xs font-bold uppercase tracking-widest mb-2">🎯 Besoin d&apos;un conseil ?</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Vous ne savez pas quel équipement choisir ?</h2>
              <p className="text-white/90 text-sm">Décrivez votre besoin et notre équipe vous proposera une solution adaptée.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/devis" className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-lg hover:bg-emerald-50 transition text-sm">Demander conseil</Link>
              <a href="https://wa.me/237697654023" target="_blank" rel="noreferrer" className="bg-[#050B16] text-white font-bold py-3 px-6 rounded-lg hover:bg-black transition text-sm">💬 WhatsApp</a>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 8 : NOS MARQUES & PARTENAIRES (tout en bas)
        ================================================================= */}
        <section className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
          <div className="text-center mb-6">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-2">Nos partenaires</p>
            <h2 className="text-xl md:text-2xl font-bold text-[#050B16]">Marques & fournisseurs</h2>
            <p className="text-sm text-gray-500 mt-2">Nous travaillons avec les leaders mondiaux du matériel électrique, réseau et sécurité.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {BRANDS.map((brand) => (
              <div key={brand} className="flex items-center justify-center px-3 py-5 rounded-lg border border-gray-100 text-gray-500 font-bold text-xs md:text-sm text-center hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition h-20">
                {brand}
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            SECTION 9 : CTA FINAL
        ================================================================= */}
        <section className="rounded-2xl bg-gradient-to-r from-[#050B16] via-[#0a1a3a] to-[#050B16] p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_50%)]" />
          <div className="relative">
            <p className="text-[#00C2FF] text-xs font-bold uppercase tracking-[0.3em] mb-3">Besoin d&apos;un équipement spécifique ?</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Nous commandons pour vous.</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Vous ne trouvez pas un produit ? Contactez-nous, nous vous le procurons et l&apos;installons pour vous.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="bg-[#00C2FF] hover:bg-[#00a8dd] text-[#050B16] font-bold py-3 px-8 rounded-lg transition">Nous contacter</Link>
              <a href="https://wa.me/237697654023" target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition">💬 WhatsApp</a>
            </div>
          </div>
        </section>

        {/* Loader */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-4">Chargement des produits…</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

// ============================================================================
//  WRAPPER AVEC SUSPENSE (obligatoire pour useSearchParams)
// ============================================================================
export default function BoutiquePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-4">Chargement de la boutique…</p>
          </div>
        </div>
      }
    >
      <BoutiqueContent />
    </Suspense>
  );
}