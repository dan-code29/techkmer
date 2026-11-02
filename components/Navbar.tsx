'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { FaUserShield } from 'react-icons/fa';
import {
  FaBars, FaTimes, FaShoppingCart, FaUser, FaSearch,
  FaSignOutAlt, FaShieldAlt, FaChevronDown, FaChevronRight,
  FaBolt, FaNetworkWired, FaHome, FaDoorOpen,
  FaClock, FaFire, FaArrowRight, FaBox, FaCog, FaSun,
  FaVideo, FaLock, FaPlug, FaTruck, FaHeart,
  FaTools, FaFileAlt,
} from 'react-icons/fa';
import { FaShieldAlt as FaSecurity } from 'react-icons/fa';

// ============================================================================
//  DONNÉES : MENUS DÉROULANTS
// ============================================================================
const SOLUTIONS_MENU = [
  { href: '/solutions/electrical', icon: FaBolt, label: 'Électricité & Solaire', desc: 'Installation, onduleurs, batteries', color: 'text-amber-500' },
  { href: '/solutions/connectivity', icon: FaNetworkWired, label: 'Réseaux & Informatique', desc: 'Câblage, Wi-Fi, baies de brassage', color: 'text-blue-500' },
  { href: '/solutions/smart', icon: FaHome, label: 'Domotique & Smart Building', desc: 'Éclairage connecté, scénarios', color: 'text-cyan-500' },
  { href: '/solutions/security', icon: FaSecurity, label: 'Sécurité électronique', desc: 'Vidéosurveillance, alarmes, accès', color: 'text-red-500' },
  { href: '/solutions/automation', icon: FaDoorOpen, label: 'Automatisation', desc: 'Portails, portes, barrières', color: 'text-purple-500' },
];

const BOUTIQUE_MENU = [
  { href: '/boutique?cat=Electrical', icon: FaBolt, label: 'Électricité & Solaire' },
  { href: '/boutique?cat=Networking', icon: FaNetworkWired, label: 'Réseau & Informatique' },
  { href: '/boutique?cat=CCTV%20%26%20Surveillance', icon: FaSecurity, label: 'Vidéosurveillance & Sécurité' },
  { href: '/boutique?cat=Smart%20Home', icon: FaHome, label: 'Domotique & Smart Building' },
  { href: '/boutique?cat=Automation', icon: FaDoorOpen, label: 'Automatisation' },
  { href: '/boutique?cat=Accessories', icon: FaBox, label: 'Accessoires & Câblage' },
];

const MEGA_MENU = {
  boutique: { title: '🛒 Boutique', items: [
    { href: '/boutique?cat=Electrical', label: 'Électricité', icon: '⚡' },
    { href: '/boutique?cat=Solar%20Energy', label: 'Énergie solaire', icon: '☀️' },
    { href: '/boutique?cat=Networking', label: 'Réseau & IT', icon: '🌐' },
    { href: '/boutique?cat=CCTV%20%26%20Surveillance', label: 'Vidéosurveillance', icon: '📹' },
  ]},
  securite: { title: '🔐 Sécurité & Domotique', items: [
    { href: '/boutique?cat=Access%20Control', label: "Contrôle d'accès", icon: '🔐' },
    { href: '/boutique?cat=Smart%20Home', label: 'Domotique', icon: '🏠' },
    { href: '/boutique?cat=Automation', label: 'Automatisation', icon: '🚪' },
    { href: '/boutique?cat=Electric%20Fence', label: 'Clôture électrique', icon: '🔥' },
  ]},
  selections: { title: '🎯 Sélections', items: [
    { href: '/boutique?filter=promo', label: 'Offres Flash', icon: '🔥' },
    { href: '/boutique?filter=best', label: 'Best Sellers', icon: '⭐' },
    { href: '/boutique?filter=new', label: 'Nouveautés', icon: '🆕' },
    { href: '/boutique?cat=Accessories', label: 'Accessoires', icon: '🔧' },
  ]},
  services: { title: '🛠️ Services', items: [
    { href: '/configurateur', label: 'Configurateur de projet', icon: '🎯' },
    { href: '/installation', label: 'Installation', icon: '🔧' },
    { href: '/maintenance', label: 'Maintenance', icon: '⚙️' },
    { href: '/devis', label: 'Demander un devis', icon: '📝' },
  ]},
};

// ============================================================================
//  TYPES POUR LA SEARCHBAR
// ============================================================================
type Product = { id: number; name: string; price: number; image: string | null; category: string };
type Suggestion = { type: 'product' | 'category' | 'solution'; id?: number; label: string; sublabel?: string; image?: string | null; href: string; icon?: any };
const POPULAR_SEARCHES = ['caméra solaire', 'onduleur', 'panneau solaire', 'câble RJ45', "contrôle d'accès", 'portail automatique'];

// ============================================================================
//  COMPOSANT : SEARCHBAR
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
    Promise.all([fetch('/api/products').then((r) => r.json()), fetch('/api/categories').then((r) => r.json()).catch(() => [])])
      .then(([prods, cats]) => { setProducts(Array.isArray(prods) ? prods : []); setCategories(Array.isArray(cats) ? cats : []); }).catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('cheffbuild-recent-searches');
    if (saved) { try { setRecentSearches(JSON.parse(saved)); } catch {} }
  }, []);

  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cheffbuild-recent-searches', JSON.stringify(updated));
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
    [{ label: 'Électricité & Solaire', href: '/services#electrical', icon: FaBolt }, { label: 'Réseaux & Informatique', href: '/services#network', icon: FaNetworkWired }, { label: 'Domotique & Smart Building', href: '/services#smart', icon: FaHome }, { label: 'Sécurité électronique', href: '/services#security', icon: FaSecurity }, { label: 'Automatisation', href: '/services#automation', icon: FaCog }]
      .filter((s) => s.label.toLowerCase().includes(q)).slice(0, 2).forEach((s) => {
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

  const navigate = (href: string) => { setIsOpen(false); onNavigate?.(); window.location.href = href; };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = suggestions.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex((i) => (i < maxIndex ? i + 1 : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex((i) => (i > 0 ? i - 1 : maxIndex)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) { const s = suggestions[highlightedIndex]; saveRecentSearch(s.label); navigate(s.href); }
      else if (query.trim()) { saveRecentSearch(query.trim()); navigate(`/boutique?q=${encodeURIComponent(query.trim())}`); }
    } else if (e.key === 'Escape') { setIsOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex group">
        <div className="relative flex-1">
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${isOpen ? 'text-[#00C2FF]' : 'text-gray-400'}`} size={14} />
          <input ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setHighlightedIndex(-1); }} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown} placeholder="Que recherchez-vous ?" className="w-full border-2 border-gray-200 border-r-0 rounded-l-xl pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#00C2FF] bg-white transition group-hover:border-[#00C2FF]/40" />
          {query && <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FaTimes size={12} /></button>}
        </div>
        <button onClick={() => { if (query.trim()) { saveRecentSearch(query.trim()); navigate(`/boutique?q=${encodeURIComponent(query.trim())}`); } }} className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold px-6 rounded-r-xl text-sm transition flex items-center gap-2">
          <FaSearch size={14} /><span className="hidden sm:inline">Rechercher</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-60 max-h-[70vh] overflow-y-auto">
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recherches récentes</p>
                  {recentSearches.map((r) => (
                    <button key={r} onClick={() => { saveRecentSearch(r); navigate(`/boutique?q=${encodeURIComponent(r)}`); }} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left"><FaClock className="text-gray-400" size={11} /><span className="text-sm text-gray-700">{r}</span></button>
                  ))}
                </div>
              )}
              <div className="p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tendances</p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((p) => (
                    <button key={p} onClick={() => { saveRecentSearch(p); navigate(`/boutique?q=${encodeURIComponent(p)}`); }} className="bg-gray-50 hover:bg-[#00C2FF]/10 text-gray-600 rounded-full px-3 py-1.5 text-xs transition">{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          {query.trim() && suggestions.length === 0 && !loading && (
             <div className="p-8 text-center"><p className="text-sm text-gray-500">Aucun résultat pour « <strong>{query}</strong> »</p></div>
          )}
          {query.trim() && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.filter((s) => s.type === 'product').map((s) => (
                <Link key={s.href} href={s.href} onClick={() => { saveRecentSearch(s.label); navigate(s.href); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                  {s.image && <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0"><Image src={s.image} alt={s.label} fill className="object-contain p-1" /></div>}
                  <div className="flex-1"><p className="text-sm font-semibold truncate">{s.label}</p><p className="text-xs text-gray-500">{s.sublabel}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
//  COMPOSANT PRINCIPAL : NAVBAR
// ============================================================================
export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [showTopBar, setShowTopBar] = useState(true);
  
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fermer le mega-menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { href: '/', label: t('home') || 'Accueil' },
    { href: '/services', label: t('services') || 'Services', hasDropdown: 'solutions' },
    { href: '/configurateur', label: '🎯 Configurateur' },
    { href: '/realisations', label: t('projects') || 'Nos réalisations' },
    { href: '/boutique', label: t('store') || 'Boutique', hasDropdown: 'boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: t('contact') || 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* 1. TOP BAR (Orange) */}
      {showTopBar && (
        <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white text-[11px] md:text-xs">
          <div className="container mx-auto px-4 py-1.5 flex items-center justify-center gap-4 md:gap-8 relative">
            <span className="flex items-center gap-2"><FaTruck size={12} /> Livraison gratuite à Douala & Yaoundé</span>
            <span className="hidden md:flex items-center gap-2"><FaClock size={12} /> Devis en 24h</span>
            <span className="hidden lg:flex items-center gap-2">💵 Paiement à la livraison</span>
            <button onClick={() => setShowTopBar(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"><FaTimes size={11} /></button>
          </div>
        </div>
      )}

      {/* 2. HEADER PRINCIPAL (Logo, Search, Panier, etc.) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center shadow-md">
              <Image src="/images/logo1.png" alt="CHEFFBUILD" width={80} height={80} className="object-contain w-full h-full p-0.5" priority />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-base leading-none text-[#050B16]">CHEFFBUILD</p>
              <p className="text-[9px] text-[#00C2FF] tracking-[0.2em] font-semibold">SMART SYSTEMS</p>
            </div>
          </Link>

          {/* Recherche Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto"><SearchBar variant="desktop" /></div>

          {/* Actions droite */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            {session ? (
              <div className="relative hidden sm:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white flex items-center justify-center text-xs font-bold">{session.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  <div className="text-left leading-tight hidden lg:block"><p className="text-[10px] text-gray-500">Bonjour</p><p className="text-sm font-semibold text-[#050B16]">{session.user?.name?.split(' ')[0] || 'Compte'}</p></div>
                  <FaChevronDown size={10} className="text-gray-400 hidden lg:block" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                    </div>
                    <Link href="/compte" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><FaUser size={12} /> Mon compte</Link>
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0066FF] hover:bg-blue-50"><FaUserShield size={12} /> Administration</Link>
                    <Link href="/favoris" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><FaHeart size={12} /> Mes favoris</Link>
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FaSignOutAlt size={12} /> Déconnexion</button>
                  </div>
                )}
              </div>
            ) : <div className="hidden"></div>}

            <Link href="/favoris" className="relative flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
              <div className="relative"><FaHeart size={18} className="text-[#050B16]" />{wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{wishlistCount}</span>}</div>
              <span className="hidden lg:block text-sm font-semibold text-[#050B16]">Favoris</span>
            </Link>

            <Link href="/panier" className="relative flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
              <div className="relative"><FaShoppingCart size={18} className="text-[#050B16]" />{totalItems > 0 && <span className="absolute -top-2 -right-2 bg-[#0066FF] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{totalItems}</span>}</div>
              <span className="hidden lg:block text-sm font-semibold text-[#050B16]">Panier</span>
            </Link>

            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <button onClick={toggleMenu} className="md:hidden p-2 text-[#050B16]">{isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}</button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3"><SearchBar variant="mobile" /></div>
      </div>

      {/* =====================================================================
          3. BARRE FUSIONNÉE (Catégories + Liens + Promos)
      ===================================================================== */}
      <div className="hidden lg:block bg-white border-b border-gray-100 shadow-sm relative" ref={categoriesRef}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* Bouton Toutes les catégories */}
            <button onClick={() => setShowCategories(!showCategories)} className="flex items-center gap-2 bg-[#050B16] hover:bg-black text-white px-5 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wide transition">
              <FaBars size={14} /> Toutes les catégories
              <FaChevronDown size={10} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>

            {/* Liens principaux */}
            <div className="flex items-center text-sm font-semibold text-[#050B16]">
              {links.map((link) => (
                <div key={link.href} className="relative group">
                  <Link href={link.href} className="flex items-center gap-1 px-3 py-3 hover:text-[#0066FF] transition">
                    {link.label}
                    {link.hasDropdown && <FaChevronDown size={9} className="text-gray-400 group-hover:text-[#0066FF] transition" />}
                  </Link>
                  
                  {/* Dropdown Services */}
                  {link.hasDropdown === 'solutions' && (
                    <div className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-105 p-3">
                        {SOLUTIONS_MENU.map((s) => { const Icon = s.icon; return (
                          <Link key={s.href} href={s.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 group/item">
                            <span className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 ${s.color}`}><Icon size={16} /></span>
                            <div><p className="text-sm font-bold text-[#050B16]">{s.label}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
                          </Link>
                        );})}
                      </div>
                    </div>
                  )}

                  {/* Dropdown Boutique */}
                  {link.hasDropdown === 'boutique' && (
                    <div className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 p-3">
                        {BOUTIQUE_MENU.map((b) => { const Icon = b.icon; return (
                          <Link key={b.href} href={b.href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 group/item">
                            <Icon className="text-gray-400 group-hover/item:text-[#0066FF]" size={14} />
                            <span className="text-sm font-medium">{b.label}</span>
                          </Link>
                        );})}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Raccourcis Promos (à droite) */}
          <div className="flex items-center gap-5 text-xs font-bold">
            <Link href="/boutique?filter=promo" className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition"><FaFire size={13} /> Offre Flash</Link>
            <Link href="/boutique?filter=best" className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 transition"><FaBolt size={13} /> Best Sellers</Link>
            <Link href="/devis" className="flex items-center gap-1.5 text-[#0066FF] hover:text-blue-700 transition"><FaFileAlt size={13} /> Devis Gratuit</Link>
          </div>

        </div>

        {/* MEGA MENU (Toutes les catégories) */}
        {showCategories && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t-2 border-[#00C2FF] z-50 animate-fadeIn">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-4 gap-6">
                {Object.values(MEGA_MENU).map((col, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] font-bold text-[#00C2FF] uppercase tracking-widest mb-3">{col.title}</p>
                    <ul className="space-y-1.5">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={() => setShowCategories(false)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0066FF] rounded-lg transition">
                            <span>{item.icon}</span>{item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. MENU MOBILE */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {links.map((link) => (
            <div key={link.href}>
              {link.hasDropdown ? (
                <>
                  <button onClick={() => setMobileSection(mobileSection === link.hasDropdown ? null : link.hasDropdown!)} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16] hover:bg-gray-50">
                    <span>{link.label}</span><FaChevronDown size={10} className={`transition-transform ${mobileSection === link.hasDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSection === 'solutions' && (
                    <div className="pl-3 py-1 space-y-0.5">{SOLUTIONS_MENU.map((s) => { const Icon = s.icon; return <Link key={s.href} href={s.href} onClick={toggleMenu} className="flex items-center gap-3 py-2 px-3 text-sm text-gray-700"><Icon className={s.color} size={12} />{s.label}</Link>; })}</div>
                  )}
                  {mobileSection === 'boutique' && (
                    <div className="pl-3 py-1 space-y-0.5">{BOUTIQUE_MENU.map((b) => { const Icon = b.icon; return <Link key={b.href} href={b.href} onClick={toggleMenu} className="flex items-center gap-3 py-2 px-3 text-sm text-gray-700"><Icon className="text-gray-400" size={12} />{b.label}</Link>; })}</div>
                  )}
                </>
              ) : (
                <Link href={link.href} onClick={toggleMenu} className="block py-2.5 px-2 rounded-lg text-sm font-semibold text-[#050B16] hover:bg-gray-50">{link.label}</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}