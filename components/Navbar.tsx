'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';   // ✅ NOUVEAU
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  FaBars, FaTimes, FaShoppingCart, FaUser, FaSearch,
  FaSignOutAlt, FaShieldAlt, FaChevronDown, FaChevronRight,
  FaBolt, FaNetworkWired, FaHome, FaDoorOpen,
  FaClock, FaFire, FaArrowRight, FaBox, FaCog, FaSun,
  FaVideo, FaLock, FaPlug, FaTruck, FaHeart,          // ✅ FaHeart ajouté
} from 'react-icons/fa';
import { FaShieldAlt as FaSecurity } from 'react-icons/fa';

// ============================================================================
//  QUICK LINKS (barre du bas) — Catégories rapides
// ============================================================================
const QUICK_LINKS = [
  { href: '/boutique?filter=promo', icon: FaFire, label: 'Offre Flash', color: 'text-red-500' },
  { href: '/boutique?filter=best', icon: FaBolt, label: 'Best Sellers', color: 'text-orange-500' },
  { href: '/boutique?cat=Electrical', icon: FaBolt, label: 'Électricité', color: 'text-amber-500' },
  { href: '/boutique?cat=CCTV%20%26%20Surveillance', icon: FaSecurity, label: 'Sécurité', color: 'text-red-500' },
  { href: '/boutique?cat=Smart%20Home', icon: FaHome, label: 'Domotique', color: 'text-cyan-500' },
  { href: '/boutique?cat=Networking', icon: FaNetworkWired, label: 'Réseau', color: 'text-blue-500' },
  { href: '/boutique?cat=Solar%20Energy', icon: FaSun, label: 'Solaire', color: 'text-yellow-500' },
  { href: '/boutique?cat=Automation', icon: FaDoorOpen, label: 'Automatisme', color: 'text-purple-500' },
  { href: '/boutique?cat=Access%20Control', icon: FaLock, label: "Contrôle d'accès", color: 'text-indigo-500' },
  { href: '/boutique?cat=Electric%20Fence', icon: FaPlug, label: 'Clôture électrique', color: 'text-orange-600' },
  { href: '/boutique?cat=Accessories', icon: FaCog, label: 'Accessoires', color: 'text-gray-600' },
];

// ============================================================================
//  MENUS DÉROULANTS DES LIENS PRINCIPAUX
// ============================================================================
const SOLUTIONS_MENU = [
  { href: '/services#electrical', icon: FaBolt, label: 'Électricité & Solaire', desc: 'Installation, onduleurs, batteries', color: 'text-amber-500' },
  { href: '/services#network', icon: FaNetworkWired, label: 'Réseaux & Informatique', desc: 'Câblage, Wi-Fi, baies de brassage', color: 'text-blue-500' },
  { href: '/services#smart', icon: FaHome, label: 'Domotique & Smart Building', desc: 'Éclairage connecté, scénarios', color: 'text-cyan-500' },
  { href: '/services#security', icon: FaSecurity, label: 'Sécurité électronique', desc: 'Vidéosurveillance, alarmes, accès', color: 'text-red-500' },
  { href: '/services#automation', icon: FaDoorOpen, label: 'Automatisation', desc: 'Portails, portes, barrières', color: 'text-purple-500' },
];

const BOUTIQUE_MENU = [
  { href: '/boutique?cat=Electrical', icon: FaBolt, label: 'Électricité & Solaire' },
  { href: '/boutique?cat=Networking', icon: FaNetworkWired, label: 'Réseau & Informatique' },
  { href: '/boutique?cat=CCTV%20%26%20Surveillance', icon: FaSecurity, label: 'Vidéosurveillance & Sécurité' },
  { href: '/boutique?cat=Smart%20Home', icon: FaHome, label: 'Domotique & Smart Building' },
  { href: '/boutique?cat=Automation', icon: FaDoorOpen, label: 'Automatisation' },
  { href: '/boutique?cat=Accessories', icon: FaBox, label: 'Accessoires & Câblage' },
];



// ============================================================================
//  TYPES POUR LA SEARCHBAR
// ============================================================================
type Product = { id: number; name: string; price: number; image: string | null; category: string };
type Suggestion = { type: 'product' | 'category' | 'solution'; id?: number; label: string; sublabel?: string; image?: string | null; href: string; icon?: any };

const POPULAR_SEARCHES = ['caméra solaire', 'onduleur', 'panneau solaire', 'câble RJ45', "contrôle d'accès", 'portail automatique'];

// ============================================================================
//  COMPOSANT SEARCHBAR
// ============================================================================
function SearchBar({ variant = 'desktop', onNavigate }: { variant?: 'desktop' | 'mobile'; onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wisbuild-recent-searches');
    if (saved) { try { setRecentSearches(JSON.parse(saved)); } catch {} }
  }, []);

  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('wisbuild-recent-searches', JSON.stringify(updated));
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => { setDebouncedQuery(query); setLoading(false); }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const suggestions: Suggestion[] = (() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Suggestion[] = [];

    products.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)).slice(0, 4).forEach((p) => {
      results.push({ type: 'product', id: p.id, label: p.name, sublabel: p.category, image: p.image, href: `/produit/${p.id}` });
    });

    categories.filter((c) => c.toLowerCase().includes(q)).slice(0, 3).forEach((c) => {
      results.push({ type: 'category', label: c, sublabel: 'Catégorie', href: `/boutique?cat=${encodeURIComponent(c)}`, icon: FaBox });
    });

    [
      { label: 'Électricité & Solaire', href: '/services#electrical', icon: FaBolt },
      { label: 'Réseaux & Informatique', href: '/services#network', icon: FaNetworkWired },
      { label: 'Domotique & Smart Building', href: '/services#smart', icon: FaHome },
      { label: 'Sécurité électronique', href: '/services#security', icon: FaSecurity },
      { label: 'Automatisation', href: '/services#automation', icon: FaCog },
    ].filter((s) => s.label.toLowerCase().includes(q)).slice(0, 2).forEach((s) => {
      results.push({ type: 'solution', label: s.label, sublabel: 'Solution', href: s.href, icon: s.icon });
    });

    return results;
  })();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (href: string) => { setIsOpen(false); onNavigate?.(); window.location.href = href; };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = suggestions.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex((i) => (i < maxIndex ? i + 1 : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex((i) => (i > 0 ? i - 1 : maxIndex)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        const s = suggestions[highlightedIndex]; saveRecentSearch(s.label); navigate(s.href);
      } else if (query.trim()) { saveRecentSearch(query.trim()); navigate(`/boutique?q=${encodeURIComponent(query.trim())}`); }
    } else if (e.key === 'Escape') { setIsOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex group">
        <div className="relative flex-1">
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${isOpen ? 'text-[#00C2FF]' : 'text-gray-400'}`} size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setHighlightedIndex(-1); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Que recherchez-vous ? (caméra, solaire, câble…)"
            className="w-full border-2 border-gray-200 border-r-0 rounded-l-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#00C2FF] bg-white transition group-hover:border-[#00C2FF]/40"
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Effacer">
              <FaTimes size={12} />
            </button>
          )}
        </div>
        <button
          onClick={() => { if (query.trim()) { saveRecentSearch(query.trim()); navigate(`/boutique?q=${encodeURIComponent(query.trim())}`); } }}
          className="bg-linear-to-r from-[#00C2FF] to-[#0066FF] hover:from-[#00a8dd] hover:to-[#0052cc] text-white font-bold px-6 rounded-r-xl text-sm transition shadow-lg shadow-[#00C2FF]/20 flex items-center gap-2"
        >
          <FaSearch size={14} />
          <span className="hidden sm:inline">Rechercher</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] max-h-[70vh] overflow-y-auto">
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recherches récentes</p>
                    <button onClick={() => { setRecentSearches([]); localStorage.removeItem('wisbuild-recent-searches'); }} className="text-[10px] text-gray-400 hover:text-red-500">Effacer</button>
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.map((r) => (
                      <button key={r} onClick={() => { saveRecentSearch(r); navigate(`/boutique?q=${encodeURIComponent(r)}`); }} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left group">
                        <FaClock className="text-gray-400 shrink-0" size={11} />
                        <span className="text-sm text-gray-700 group-hover:text-[#0066FF] flex-1 truncate">{r}</span>
                        <FaArrowRight className="text-gray-300 opacity-0 group-hover:opacity-100 transition" size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaFire className="text-orange-500" size={11} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tendances</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((p) => (
                    <button key={p} onClick={() => { saveRecentSearch(p); navigate(`/boutique?q=${encodeURIComponent(p)}`); }} className="bg-gray-50 hover:bg-[#00C2FF]/10 hover:text-[#0066FF] text-gray-600 rounded-full px-3 py-1.5 text-xs font-medium transition">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {query.trim() && suggestions.length === 0 && !loading && (
            <div className="p-8 text-center">
              <FaSearch className="text-gray-300 mx-auto mb-3" size={32} />
              <p className="text-sm text-gray-500">Aucun résultat pour « <strong>{query}</strong> »</p>
            </div>
          )}

          {query.trim() && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.filter((s) => s.type === 'product').length > 0 && (
                <div>
                  <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produits</p>
                  {suggestions.filter((s) => s.type === 'product').map((s) => {
                    const globalIdx = suggestions.indexOf(s);
                    const highlighted = highlightedIndex === globalIdx;
                    return (
                      <Link key={`p-${s.id}`} href={s.href} onClick={() => { saveRecentSearch(s.label); navigate(s.href); }} onMouseEnter={() => setHighlightedIndex(globalIdx)} className={`flex items-center gap-3 px-4 py-2.5 transition ${highlighted ? 'bg-[#00C2FF]/10' : 'hover:bg-gray-50'}`}>
                        <div className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                          {s.image && <Image src={s.image} alt={s.label} fill className="object-contain p-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#050B16] truncate">{s.label}</p>
                          {s.sublabel && <p className="text-xs text-gray-500 truncate">{s.sublabel}</p>}
                        </div>
                        <FaArrowRight className={`shrink-0 ${highlighted ? 'text-[#0066FF]' : 'text-gray-300'}`} size={10} />
                      </Link>
                    );
                  })}
                </div>
              )}
              {suggestions.filter((s) => s.type === 'category').length > 0 && (
                <div className="border-t border-gray-100">
                  <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégories</p>
                  {suggestions.filter((s) => s.type === 'category').map((s) => {
                    const globalIdx = suggestions.indexOf(s);
                    const highlighted = highlightedIndex === globalIdx;
                    return (
                      <Link key={`c-${s.label}`} href={s.href} onClick={() => { saveRecentSearch(s.label); navigate(s.href); }} onMouseEnter={() => setHighlightedIndex(globalIdx)} className={`flex items-center gap-3 px-4 py-2.5 transition ${highlighted ? 'bg-[#00C2FF]/10' : 'hover:bg-gray-50'}`}>
                        <span className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          <FaBox className="text-gray-400" size={14} />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#050B16]">{s.label}</p>
                          <p className="text-xs text-gray-500">Voir la catégorie</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {query.trim() && suggestions.length > 0 && (
            <button onClick={() => { saveRecentSearch(query.trim()); navigate(`/boutique?q=${encodeURIComponent(query.trim())}`); }} className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#0066FF]/5 border-t border-gray-100 py-3 text-xs font-bold text-[#0066FF]">
              Voir tous les résultats pour « {query} » <FaArrowRight size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
//  NAVBAR PRINCIPAL
// ============================================================================
export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();       // ✅ NOUVEAU

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);

  // ✅ NOUVEAU : Sticky intelligent
  const [showQuickNav, setShowQuickNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // ✅ NOUVEAU : Logique du sticky intelligent
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Toujours visible en haut de page
      if (currentY < 80) {
        setShowQuickNav(true);
      } else if (currentY > lastScrollY + 10) {
        // Scroll vers le bas → cacher
        setShowQuickNav(false);
      } else if (currentY < lastScrollY - 10) {
        // Scroll vers le haut → montrer
        setShowQuickNav(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Liens principaux (affichés AU-DESSUS de la quick nav)
 const links = [
  { href: '/', label: t('home') || 'Accueil' },
  { href: '/services', label: t('services') || 'Services', hasDropdown: 'solutions' },
  { href: '/configurateur', label: '🎯 Configurateur' },   // ✅ AJOUTÉ
  { href: '/realisations', label: t('projects') || 'Nos réalisations' },
  { href: '/boutique', label: t('store') || 'Boutique', hasDropdown: 'boutique' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: t('contact') || 'Contact' },
];

  return (
    <nav className="sticky top-0 z-50">

      {/* ===================================================================
          1. TOP BAR (bandeau orange annonces)
      =================================================================== */}
      {showTopBar && (
        <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white text-xs md:text-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-4 md:gap-8 relative">
            <span className="flex items-center gap-2"><FaTruck size={12} /> Livraison gratuite à Douala & Yaoundé</span>
            <span className="hidden md:flex items-center gap-2"><FaClock size={12} /> Devis en 24h</span>
            <span className="hidden lg:flex items-center gap-2">💵 Paiement à la livraison</span>
            <button onClick={() => setShowTopBar(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Fermer">
              <FaTimes size={11} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. HEADER PRINCIPAL (Logo + Recherche + Compte + Favoris + Panier)
      =================================================================== */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#0066FF]/20 group-hover:shadow-[#00C2FF]/40 transition">
              <Image src="/images/logo.png" alt="WISEBUILD" width={80} height={80} className="object-contain w-full h-full p-0.5" priority />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-base leading-none text-[#050B16]">WISEBUILD</p>
              <p className="text-[9px] text-[#00C2FF] tracking-[0.2em] font-semibold">SMART SYSTEMS</p>
            </div>
          </Link>

          {/* Barre de recherche desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <SearchBar variant="desktop" />
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            {/* Compte */}
            {session ? (
              <div className="relative hidden sm:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-[10px] text-gray-500">Bonjour</p>
                    <p className="text-sm font-semibold text-[#050B16]">{session.user?.name?.split(' ')[0] || 'Compte'}</p>
                  </div>
                  <FaChevronDown size={10} className="text-gray-400 hidden lg:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-[#050B16] truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/compte" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaUser size={12} /> Mon compte
                    </Link>
                    <Link href="/favoris" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaHeart size={12} /> Mes favoris
                    </Link>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FaShieldAlt size={12} /> Admin
                      </Link>
                    )}
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FaSignOutAlt size={12} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:shadow-lg hover:shadow-[#00C2FF]/30 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition">
                <FaUser size={12} /> Connexion
              </Link>
            )}

            {/* ✅ NOUVEAU : Favoris (wishlist) */}
            <Link href="/favoris" className="relative flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
              <div className="relative">
                <FaHeart size={18} className="text-[#050B16]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-semibold text-[#050B16]">Favoris</span>
            </Link>

            {/* Panier */}
            <Link href="/panier" className="relative flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
              <div className="relative">
                <FaShoppingCart size={20} className="text-[#050B16]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0066FF] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-semibold text-[#050B16]">Panier</span>
            </Link>

            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <button onClick={toggleMenu} className="md:hidden p-2 text-[#050B16]" aria-label="Menu">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar variant="mobile" />
        </div>
      </div>

      {/* ===================================================================
          3. LIENS PRINCIPAUX (Accueil, Services, Réalisations…)
      =================================================================== */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-1 text-sm font-semibold text-[#050B16]">
          {links.map((link) => (
            <div key={link.href} className="relative group">
              <Link href={link.href} className="flex items-center gap-1.5 px-3 py-3 hover:text-[#0066FF] transition relative">
                {link.label}
                {link.hasDropdown && <FaChevronDown size={9} className="text-gray-400 group-hover:rotate-180 group-hover:text-[#0066FF] transition-transform duration-300" />}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#0066FF] to-[#00C2FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Dropdown Solutions */}
              {link.hasDropdown === 'solutions' && (
                <div className="absolute left-0 top-full pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 w-[420px] p-3">
                    {SOLUTIONS_MENU.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link key={s.href} href={s.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition group/item">
                          <span className={`w-10 h-10 rounded-lg bg-gray-50 group-hover/item:bg-white flex items-center justify-center shrink-0 ${s.color}`}><Icon size={16} /></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#050B16] group-hover/item:text-[#0066FF] transition">{s.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                          </div>
                          <FaChevronRight size={10} className="text-gray-300 group-hover/item:text-[#0066FF] mt-3 transition" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dropdown Boutique */}
              {link.hasDropdown === 'boutique' && (
                <div className="absolute left-0 top-full pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 w-[320px] p-3">
                    {BOUTIQUE_MENU.map((b) => {
                      const Icon = b.icon;
                      return (
                        <Link key={b.href} href={b.href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition group/item">
                          <Icon className="text-gray-400 group-hover/item:text-[#0066FF] shrink-0" size={14} />
                          <span className="text-sm text-[#050B16] group-hover/item:text-[#0066FF] font-medium transition">{b.label}</span>
                          <FaChevronRight size={9} className="ml-auto text-gray-300 group-hover/item:text-[#0066FF] transition" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================
          4. QUICK NAV — Sticky intelligent
          Elle se cache en descendant, réapparaît en remontant
      =================================================================== */}
      <div
        className={`hidden md:block bg-gradient-to-r from-[#050B16] via-[#0a1428] to-[#050B16] text-white shadow-lg overflow-x-auto transition-all duration-300 ${
          showQuickNav
            ? 'max-h-20 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center gap-6 py-3 whitespace-nowrap text-xs font-bold">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-1.5 hover:text-[#00C2FF] transition group">
                <Icon className={`${link.color} group-hover:scale-125 transition`} size={14} />
                <span className="uppercase tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          5. MENU MOBILE
      =================================================================== */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {/* Liens principaux */}
          {links.map((link) => (
            <div key={link.href}>
              {link.hasDropdown ? (
                <>
                  <button onClick={() => setMobileSection(mobileSection === link.hasDropdown ? null : link.hasDropdown!)} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16] hover:bg-gray-50">
                    <span>{link.label}</span>
                    <FaChevronDown size={10} className={`text-gray-400 transition-transform ${mobileSection === link.hasDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSection === 'solutions' && (
                    <div className="pl-3 py-1 space-y-0.5">
                      {SOLUTIONS_MENU.map((s) => {
                        const Icon = s.icon;
                        return <Link key={s.href} href={s.href} onClick={toggleMenu} className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><Icon className={s.color} size={12} />{s.label}</Link>;
                      })}
                    </div>
                  )}
                  {mobileSection === 'boutique' && (
                    <div className="pl-3 py-1 space-y-0.5">
                      {BOUTIQUE_MENU.map((b) => {
                        const Icon = b.icon;
                        return <Link key={b.href} href={b.href} onClick={toggleMenu} className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><Icon className="text-gray-400" size={12} />{b.label}</Link>;
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link href={link.href} onClick={toggleMenu} className="block py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16] hover:bg-gray-50">{link.label}</Link>
              )}
            </div>
          ))}

          {/* Quick links mobile */}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Catégories rapides</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={toggleMenu} className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-1.5 text-xs font-semibold text-[#050B16]">
                    <Icon className={link.color} size={11} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Actions compte */}
          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
            {session ? (
              <>
                <Link href="/compte" onClick={toggleMenu} className="flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16]"><FaUser size={12} /> Mon compte</Link>
                <Link href="/favoris" onClick={toggleMenu} className="flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16]"><FaHeart size={12} /> Mes favoris ({wishlistCount})</Link>
                <button onClick={() => { signOut(); toggleMenu(); }} className="w-full flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold text-red-600 text-left"><FaSignOutAlt size={12} /> Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/favoris" onClick={toggleMenu} className="flex items-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16]"><FaHeart size={12} /> Mes favoris ({wishlistCount})</Link>
                <Link href="/login" onClick={toggleMenu} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0066FF] to-[#00C2FF] text-white px-4 py-2.5 rounded-lg text-sm font-semibold">Connexion</Link>
              </>
            )}
            <div className="pt-2"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </nav>
  );
}