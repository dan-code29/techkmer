'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import {
  FaBolt, FaSun, FaNetworkWired, FaShieldAlt, FaHome,
  FaDoorOpen, FaArrowRight, FaWhatsapp, FaPhone,
  FaEnvelope, FaCog, FaStar, FaQuoteLeft,
  FaClipboardList, FaSearchDollar, FaTools, FaHeadset,
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  salesCount: number;
  isPromotion: number;
  dateAdded: string;
};

/* ------------------------------------------------------------------ */
/*  DONNÉES STATIQUES                                                   */
/* ------------------------------------------------------------------ */
const SOLUTIONS = [
  {
    id: 'energy',
    icon: FaBolt,
    label: 'ENERGY',
    subtitle: 'Électricité & Solaire',
    items: ['Systèmes électriques', 'Énergie solaire', 'Onduleurs & batteries', 'Éclairage'],
    color: 'text-amber-400',
    href: '/services#electrical',
  },
  {
    id: 'connectivity',
    icon: FaNetworkWired,
    label: 'CONNECTIVITY',
    subtitle: 'Réseaux & Informatique',
    items: ['Infrastructure réseau', 'Wi-Fi pro', 'Câblage structuré', 'Téléphonie IP'],
    color: 'text-blue-400',
    href: '/services#network',
  },
  {
    id: 'smart',
    icon: FaHome,
    label: 'SMART BUILDING',
    subtitle: 'Domotique & Automatisation',
    items: ['Domotique', 'Éclairage intelligent', 'Accès connecté', 'Scénarios'],
    color: 'text-cyan-400',
    href: '/services#smart',
  },
  {
    id: 'security',
    icon: FaShieldAlt,
    label: 'SECURITY',
    subtitle: 'Sécurité électronique',
    items: ['Vidéosurveillance', 'Contrôle d’accès', 'Alarmes', 'Clôtures électriques'],
    color: 'text-red-400',
    href: '/services#security',
  },
  {
    id: 'automation',
    icon: FaCog,
    label: 'AUTOMATION',
    subtitle: 'Automatisation',
    items: ['Portails motorisés', 'Portes automatiques', 'Barrières', 'Industriel'],
    color: 'text-purple-400',
    href: '/services#automation',
  },
];

const WHY_US = [
  { n: '01', title: 'Solutions intégrées', desc: 'Un seul partenaire pour plusieurs systèmes techniques.' },
  { n: '02', title: 'Installation professionnelle', desc: 'Conception, pose, configuration et mise en service.' },
  { n: '03', title: 'Équipements de qualité', desc: 'Matériel fiable sélectionné pour un usage professionnel.' },
  { n: '04', title: 'Support après-vente', desc: 'Maintenance, dépannage et assistance technique.' },
  { n: '05', title: 'Solutions sur mesure', desc: 'Chaque projet est conçu autour de votre bâtiment.' },
];

const PROJECTS = [
  { img: '/images/projects/cctv.jpg', tag: 'Sécurité', title: 'Vidéosurveillance commerciale' },
  { img: '/images/projects/solar.jpg', tag: 'Solaire', title: 'Installation solaire résidentielle' },
  { img: '/images/projects/network.jpg', tag: 'Réseau', title: 'Infrastructure réseau entreprise' },
  { img: '/images/projects/smart-home.jpg', tag: 'Domotique', title: 'Maison connectée' },
];

const SOLUTION_FINDER = [
  { icon: FaHome, label: 'Sécuriser ma maison', href: '/devis?domaine=securite' },
  { icon: FaShieldAlt, label: 'Sécuriser mon entreprise', href: '/devis?domaine=securite' },
  { icon: FaSun, label: 'Passer au solaire', href: '/devis?domaine=solaire' },
  { icon: FaNetworkWired, label: 'Installer un réseau', href: '/devis?domaine=reseau' },
  { icon: FaHome, label: 'Maison connectée', href: '/devis?domaine=domotique' },
  { icon: FaDoorOpen, label: 'Portail automatique', href: '/devis?domaine=automatisme' },
  { icon: FaBolt, label: 'Installation électrique', href: '/devis?domaine=electricite' },
];

const HOW_IT_WORKS = [
  { n: 1, icon: FaClipboardList, title: 'Audit du besoin', desc: 'Nous analysons votre projet et vos contraintes.' },
  { n: 2, icon: FaSearchDollar, title: 'Devis gratuit', desc: 'Proposition transparente sous 24h, sans engagement.' },
  { n: 3, icon: FaTools, title: 'Installation', desc: 'Conception, pose et mise en service par nos techniciens.' },
  { n: 4, icon: FaHeadset, title: 'Maintenance', desc: 'Suivi, garantie 12 mois et assistance continue.' },
];

const TESTIMONIALS = [
  {
    name: 'Marie N.',
    role: 'Directrice — Cabinet médical, Douala',
    text: 'Équipe très professionnelle. Ils ont installé notre système de vidéosurveillance et l’alarme en une journée. Zéro problème depuis 8 mois.',
    rating: 5,
  },
  {
    name: 'Jean-Pierre T.',
    role: 'Propriétaire villa, Bafoussam',
    text: 'Installation solaire impeccable. Nous avons maintenant de l’électricité même pendant les coupures. Explications claires et suivi assuré.',
    rating: 5,
  },
  {
    name: 'Estelle M.',
    role: 'Responsable IT — PME, Yaoundé',
    text: 'Ils ont refait tout notre réseau et câblage. La différence de débit est spectaculaire. Documentation livrée et support réactif.',
    rating: 5,
  },
];

const STATS = [
  { value: 150, suffix: '+', label: 'Projets réalisés' },
  { value: 10, suffix: '', label: 'Régions couvertes' },
  { value: 24, suffix: 'h', label: 'Délai de réponse' },
  { value: 100, suffix: '%', label: 'Clients satisfaits' },
];

/* ------------------------------------------------------------------ */
/*  HOOK COMPTEUR ANIMÉ                                                */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

/* ------------------------------------------------------------------ */
/*  HOME PAGE                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  /* Chargement produits */
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Observer pour déclencher les compteurs */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const promoProducts = useMemo(
    () => products.filter((p) => p.isPromotion === 1).slice(0, 4),
    [products]
  );
  const bestSellers = useMemo(
    () => [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 4),
    [products]
  );
  const newArrivals = useMemo(
    () =>
      [...products]
        .sort((a, b) => {
          const da = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
          const db = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
          return db - da;
        })
        .slice(0, 4),
    [products]
  );

  return (
    <div className="bg-white">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative bg-[#050B16] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/smart-building.jpg"
            alt="Smart building"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/85 to-[#050B16]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_45%)] opacity-20" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 py-24 md:py-32 max-w-3xl">
          <span className="inline-block bg-[#0066FF]/20 border border-[#00C2FF]/40 text-[#00C2FF] text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            SMART SYSTEMS & TECHNOLOGIES
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            SMART TECHNOLOGY
            <br />
            FOR <span className="text-[#00C2FF]">SMARTER SPACES</span>
          </h1>

          <p className="text-base md:text-lg text-gray-300 mb-2 tracking-wider font-medium">
            ⚡ Electrical • ☀️ Solar • 🌐 Networking • 🏠 Automation • 🛡️ Security
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl">
            Nous concevons, installons et maintenons des systèmes techniques complets
            pour les bâtiments modernes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-4 px-8 rounded-lg transition flex items-center gap-2 shadow-lg shadow-[#0066FF]/30"
            >
              EXPLORE SOLUTIONS <FaArrowRight />
            </Link>
            <Link
              href="/devis"
              className="border-2 border-white/30 hover:border-[#00C2FF] hover:text-[#00C2FF] text-white font-bold py-4 px-8 rounded-lg transition"
            >
              REQUEST A QUOTE
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Disponible 24/7
            </span>
            <span>✓ Techniciens certifiés</span>
            <span>✓ Garantie 12 mois</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS ANIMÉES (nouveau)                                     */}
      {/* ============================================================ */}
      <section ref={statsRef} className="bg-white border-b">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <StatItem
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              start={statsVisible}
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OUR SOLUTIONS (5 piliers)                                   */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#050B16] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#00C2FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Our Solutions
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              One company. <span className="text-[#00C2FF]">Complete solutions.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cinq pôles techniques, une seule équipe pour concevoir, installer et maintenir
              l'ensemble de vos infrastructures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {SOLUTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className="group bg-white/5 border border-white/10 hover:border-[#00C2FF]/60 rounded-2xl p-6 transition duration-300 hover:-translate-y-2 hover:bg-white/10 backdrop-blur-sm"
                >
                  <Icon className={`${s.color} mb-4`} size={36} />
                  <h3 className="text-sm font-bold tracking-widest text-[#00C2FF] mb-1">
                    {s.label}
                  </h3>
                  <p className="text-base font-semibold mb-3">{s.subtitle}</p>
                  <ul className="space-y-1.5 mb-5 text-xs text-gray-400">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="text-[#00C2FF]">•</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <span className="text-[#00C2FF] text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Découvrir <FaArrowRight size={10} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY CHOOSE US                                               */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Pourquoi nous choisir
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#050B16]">
              Why choose us?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {WHY_US.map((w) => (
              <div key={w.n} className="border-t-2 border-[#0066FF] pt-6">
                <p className="text-4xl font-bold text-[#00C2FF] mb-3">{w.n}</p>
                <h3 className="font-bold text-[#050B16] mb-2">{w.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS (nouveau)                                      */}
      {/* ============================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#050B16]">
              Votre projet en 4 étapes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Ligne de connexion (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-[#00C2FF]/20 z-0" />

            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-white border-2 border-[#0066FF] flex items-center justify-center shadow-lg mb-4 relative">
                    <Icon className="text-[#0066FF]" size={32} />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0066FF] text-white text-sm font-bold flex items-center justify-center">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#050B16] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OUR PROJECTS                                                */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between mb-10">
            <div>
              <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-2">
                Our Projects
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#050B16]">
                Ce que nous réalisons
              </h2>
            </div>
            <Link
              href="/realisations"
              className="text-[#0066FF] font-semibold hover:underline flex items-center gap-2"
            >
              Voir tous les projets <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROJECTS.map((p) => (
              <Link
                key={p.title}
                href="/realisations"
                className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition"
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <span className="inline-block bg-[#00C2FF] text-[#050B16] text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-widest">
                    {p.tag}
                  </span>
                  <p className="font-bold text-base leading-tight">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOUTIQUE : PROMOS + BEST SELLERS + NEW ARRIVALS             */}
      {/* ============================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-2">
              Shop Our Products
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#050B16] mb-3">
              Équipements professionnels
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les produits que nous installons, disponibles dans notre boutique en ligne.
            </p>
          </div>

          {promoProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-bold text-[#050B16] uppercase tracking-wide">
                  Offres spéciales
                </h3>
                <Link href="/boutique?filter=promo" className="ml-auto text-sm text-[#0066FF] font-semibold hover:underline">
                  Tout voir →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {promoProducts.map((p) => <ProductCard key={p.id} product={p} highlight />)}
              </div>
            </div>
          )}

          {bestSellers.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⭐</span>
                <h3 className="text-xl font-bold text-[#050B16] uppercase tracking-wide">
                  Best Sellers
                </h3>
                <Link href="/boutique?filter=best" className="ml-auto text-sm text-[#0066FF] font-semibold hover:underline">
                  Tout voir →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {newArrivals.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🆕</span>
                <h3 className="text-xl font-bold text-[#050B16] uppercase tracking-wide">
                  Nouveautés
                </h3>
                <Link href="/boutique" className="ml-auto text-sm text-[#0066FF] font-semibold hover:underline">
                  Tout voir →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {loading && (
            <p className="text-center text-gray-400 py-10">Chargement des produits…</p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TÉMOIGNAGES (nouveau)                                       */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Témoignages
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#050B16]">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative hover:shadow-lg transition"
              >
                <FaQuoteLeft className="text-[#00C2FF]/30 absolute top-6 right-6" size={28} />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} className="text-amber-400" size={14} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 italic">
                  « {t.text} »
                </p>
                <div>
                  <p className="font-bold text-[#050B16]">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SOLUTION FINDER                                             */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#050B16] text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-[#00C2FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Solution Finder
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              De quoi avez-vous besoin ?
            </h2>
            <p className="text-gray-400">
              Choisissez votre besoin — nous vous guidons vers la bonne solution.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SOLUTION_FINDER.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group flex items-center gap-3 bg-white/5 border border-white/10 hover:border-[#00C2FF] hover:bg-[#00C2FF]/10 rounded-xl p-4 transition"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#00C2FF]/20 flex items-center justify-center text-[#00C2FF] shrink-0">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-semibold leading-snug">{s.label}</span>
                  <FaArrowRight className="ml-auto text-[#00C2FF] opacity-0 group-hover:opacity-100 transition" size={12} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA FINAL                                                   */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/circuit-pattern.png')] bg-cover" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            LET'S BUILD SMARTER SPACES.
          </h2>
          <p className="text-lg text-white/90 mb-10">
            De l'énergie à la connectivité, de l'automatisation à la sécurité —
            nous concevons et intégrons des solutions techniques complètes.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/devis"
              className="bg-white text-[#0066FF] font-bold py-4 px-10 rounded-lg transition hover:bg-gray-100 shadow-xl"
            >
              REQUEST A QUOTE
            </Link>
            <a
              href="https://wa.me/237697654023"
              target="_blank"
              rel="noreferrer"
              className="bg-[#050B16] text-white font-bold py-4 px-10 rounded-lg transition hover:bg-black flex items-center gap-2"
            >
              <FaWhatsapp /> TALK TO AN EXPERT
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <a href="tel:+237697654023" className="flex items-center gap-2 hover:text-white">
              <FaPhone /> 697654023
            </a>
            <a href="mailto:dancheffo29@gmail.com" className="flex items-center gap-2 hover:text-white">
              <FaEnvelope /> dancheffo29@gmail.com
            </a>
            <span>📍 Douala, Cameroun</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STAT ITEM (compteur animé)                                         */
/* ------------------------------------------------------------------ */
function StatItem({
  value,
  suffix,
  label,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const count = useCountUp(value, 1500, start);
  return (
    <div>
      <p className="text-3xl md:text-4xl font-bold text-[#0066FF]">
        {count}
        {suffix}
      </p>
      <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PRODUCT CARD                                                       */
/* ------------------------------------------------------------------ */
function ProductCard({
  product,
  highlight = false,
}: {
  product: Product;
  highlight?: boolean;
}) {
  const imageSrc =
    product.image && typeof product.image === 'string'
      ? product.image
      : '/images/placeholder.jpg';

  return (
    <Link
      href={`/produit/${product.id}`}
      className={`group bg-white rounded-xl overflow-hidden border transition hover:shadow-2xl hover:-translate-y-1 ${
        highlight ? 'border-[#00C2FF]/50' : 'border-gray-100'
      }`}
    >
      <div className="relative h-44 bg-gray-50">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition duration-300"
        />
        {product.isPromotion === 1 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            PROMO
          </span>
        )}
        {product.salesCount > 50 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            🔥 TOP
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-[#00C2FF] font-bold uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-[#050B16] line-clamp-2 mb-3 leading-snug min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-[#0066FF] font-bold text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}