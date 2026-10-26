'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

const POLES = [
  {
    slug: 'electrical',
    name: 'CHEFFBUILD ELECTRICAL',
    tagline: 'Énergie & Solaire',
    desc: 'Installation électrique bâtiment, mise aux normes, tableaux, circuits, panneaux solaires photovoltaïques, batteries lithium et onduleurs hybrides.',
  },
  {
    slug: 'connectivity',
    name: 'CHEFFBUILD CONNECTIVITY',
    tagline: 'Réseaux & Informatique',
    desc: 'Installation réseau complète : câblage structuré RJ45 / fibre optique, Wi-Fi 6 professionnel, baies de brassage, téléphonie IP, serveurs et sauvegarde.',
  },
  {
    slug: 'smart',
    name: 'CHEFFBUILD SMART',
    tagline: 'Domotique & Smart Building',
    desc: 'Éclairage intelligent, thermostats connectés, intégration multi-protocoles (KNX, Zigbee, Wi-Fi) et contrôle à distance via smartphone.',
  },
  {
    slug: 'security',
    name: 'CHEFFBUILD SECURITY',
    tagline: 'Sécurité électronique',
    desc: 'Vidéosurveillance IP HD/4K, NVR / XVR, alarmes intrusion, contrôle d’accès, interphonie vidéo, clôtures électriques et supervision par IA.',
  },
  {
    slug: 'automation',
    name: 'CHEFFBUILD AUTOMATION',
    tagline: 'Automatisation',
    desc: 'Motorisation de portails coulissants et battants, portes de garage, barrières et portiques, avec télécommande et application mobile.',
  },
  {
    slug: 'store',
    name: 'CHEFFBUILD STORE',
    tagline: 'Boutique en ligne',
    desc: 'Vente d’équipements électriques, solaires, réseau, CCTV et domotique — produits testés, garantis, avec conseil technique et SAV.',
    href: '/boutique',
  },
  {
    slug: 'care',
    name: 'CHEFFBUILD CARE',
    tagline: 'Maintenance & Administration',
    desc: 'Maintenance dans tous nos domaines techniques, maintenance générale du bâtiment et administration technique — un contrat unique pour tout votre bâtiment.',
    href: '/care',
    highlight: true,
  },
];

const HERO_GALLERY = [
  '/images/realisations/project-1.jpg',
  '/images/realisations/project-2.jpg',
  '/images/realisations/project-3.jpg',
  '/images/realisations/project-4.jpg',
  '/images/realisations/project-5.jpg',
];

type Stats = {
  projects: number;
  regions: number;
  responseTime: string;
  warranty: string;
};

const DEFAULT_STATS: Stats = {
  projects: 50,
  regions: 10,
  responseTime: '24h',
  warranty: '12',
};

export default function AboutPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: Stats) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        console.warn('Stats fallback:', err);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF] text-gray-900">
      {/* ======================================================== */}
      {/* ============ FOND DYNAMIQUE (réseau/élec/domo) ========== */}
      {/* ======================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Orbes flottants */}
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 right-1/4 h-[450px] w-[450px] rounded-full bg-[#7C3AED]/10 blur-3xl" />

        {/* Grille de points */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 3000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00C2FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#0066FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ——— RÉSEAU : lignes + nœuds ——— */}
          <g stroke="url(#link-grad)" strokeWidth="1.5" fill="none" strokeDasharray="4 6">
            <path className="animate-dash" d="M150,300 Q400,200 650,400 T1100,320" />
            <path className="animate-dash animation-delay-2000" d="M80,900 Q350,780 650,950 T1100,880" />
            <path className="animate-dash animation-delay-4000" d="M200,1700 Q450,1580 750,1780 T1150,1700" />
            <path className="animate-dash" d="M120,2400 Q400,2280 700,2480 T1050,2420" />
          </g>

          <g fill="#0066FF">
            <circle cx="150" cy="300" r="4" className="animate-pulse" />
            <circle cx="650" cy="400" r="3" className="animate-pulse animation-delay-2000" />
            <circle cx="1100" cy="320" r="4" className="animate-pulse animation-delay-4000" />
            <circle cx="650" cy="950" r="3" className="animate-pulse" />
            <circle cx="1100" cy="880" r="4" className="animate-pulse animation-delay-2000" />
            <circle cx="750" cy="1780" r="3" className="animate-pulse animation-delay-4000" />
            <circle cx="700" cy="2480" r="4" className="animate-pulse" />
            <circle cx="1150" cy="1700" r="3" className="animate-pulse animation-delay-2000" />
          </g>

          {/* ——— ÉLECTRICITÉ : éclairs en zigzag ——— */}
          <g stroke="url(#spark-grad)" strokeWidth="2" fill="none" strokeLinecap="round">
            <path
              className="animate-spark"
              d="M 900 600 L 920 580 L 940 620 L 960 560 L 980 640 L 1000 600"
            />
            <path
              className="animate-spark animation-delay-2000"
              d="M 250 1500 L 270 1480 L 290 1520 L 310 1460 L 330 1540 L 350 1500"
            />
            <path
              className="animate-spark animation-delay-4000"
              d="M 950 2200 L 970 2180 L 990 2220 L 1010 2160 L 1030 2240 L 1050 2200"
            />
          </g>

          {/* ——— DOMOTIQUE : ondes Wi-Fi ——— */}
          <g stroke="#00C2FF" strokeWidth="2" fill="none" strokeLinecap="round">
            <g className="animate-wifi">
              <path d="M 350 800 Q 400 750 450 800" opacity="0.3" />
              <path d="M 350 800 Q 425 715 500 800" opacity="0.5" />
              <path d="M 350 800 Q 450 680 550 800" opacity="0.7" />
              <circle cx="450" cy="800" r="4" fill="#00C2FF" />
            </g>
            <g className="animate-wifi animation-delay-2000">
              <path d="M 780 1350 Q 830 1300 880 1350" opacity="0.3" />
              <path d="M 780 1350 Q 855 1265 930 1350" opacity="0.5" />
              <path d="M 780 1350 Q 880 1230 980 1350" opacity="0.7" />
              <circle cx="880" cy="1350" r="4" fill="#00C2FF" />
            </g>
            <g className="animate-wifi animation-delay-4000">
              <path d="M 250 2050 Q 300 2000 350 2050" opacity="0.3" />
              <path d="M 250 2050 Q 325 1965 400 2050" opacity="0.5" />
              <path d="M 250 2050 Q 350 1930 450 2050" opacity="0.7" />
              <circle cx="350" cy="2050" r="4" fill="#00C2FF" />
            </g>
          </g>
        </svg>
      </div>

      {/* ======================================================== */}
      {/* ============ CONTENU ============ */}
      {/* ======================================================== */}
      <div className="relative z-10">
        {/* ============ HERO avec GALERIE ============ */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Texte */}
            <div>
              <span className="mb-5 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
                Connecter • Sécuriser • Automatiser
              </span>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                {t('aboutTitle') || 'À propos de'}{' '}
                <span className="animate-gradient bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#0066FF] bg-clip-text text-transparent">
                  CHEFFBUILD
                </span>
              </h1>
              <p className="mb-8 max-w-xl text-lg text-gray-700 md:text-xl">
                Intégrateur camerounais de solutions techniques du bâtiment. Un seul
                partenaire pour concevoir, installer et maintenir les infrastructures
                qui rendent vos espaces plus{' '}
                <span className="font-semibold text-[#0066FF]">
                  sûrs, connectés et intelligents
                </span>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/devis"
                  className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-7 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Demander un devis
                </Link>
                <Link
                  href="/realisations"
                  className="rounded-full border border-gray-300 bg-white/80 px-7 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
                >
                  Voir nos réalisations
                </Link>
              </div>
            </div>

            {/* Galerie 5 photos (bento) */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                {/* Grande photo en haut */}
                <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-lg shadow-[#0066FF]/10 backdrop-blur-md">
                  <Image
                    src={HERO_GALLERY[0]}
                    alt="Réalisation CHEFFBUILD 1"
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                {/* 4 photos carrées */}
                {HERO_GALLERY.slice(1).map((src, i) => (
                  <div
                    key={src}
                    className="aspect-square overflow-hidden rounded-xl border border-white/70 bg-white/70 shadow-md shadow-[#0066FF]/10 backdrop-blur-md"
                  >
                    <Image
                      src={src}
                      alt={`Réalisation CHEFFBUILD ${i + 2}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              {/* Badge flottant */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#0066FF]">
                  Portfolio
                </div>
                <div className="text-sm font-medium text-gray-900">150+ projets livrés</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STATS DYNAMIQUES ============ */}
        <section className="container mx-auto px-4 pb-16 md:pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: 'projects' as const, label: 'Projets réalisés', suffix: '+' },
              { key: 'regions' as const, label: 'Régions couvertes', suffix: '' },
              { key: 'responseTime' as const, label: 'Délai de réponse', suffix: '' },
              { key: 'warranty' as const, label: 'Mois de garantie', suffix: '' },
            ].map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:shadow-md"
              >
                {statsLoading ? (
                  <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200 md:h-10" />
                ) : (
                  <div className="text-3xl font-bold text-[#0066FF] md:text-4xl">
                    {stats[stat.key]}
                    {stat.suffix}
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ QUI SOMMES-NOUS ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Qui sommes-nous&nbsp;?
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">CHEFFBUILD Smart Systems</strong> est
                  une entreprise camerounaise spécialisée dans l’intégration technologique
                  du bâtiment. Nous accompagnons particuliers, résidences, promoteurs, PME
                  et institutions dans la conception, l’installation et la maintenance de
                  leurs infrastructures techniques.
                </p>
                <p>
                  De l’électricité au solaire, du réseau à la domotique, de la sécurité à
                  l’automatisation — nous bâtissons, connectons, sécurisons et automatisent
                  les espaces pour un avenir plus intelligent.
                </p>
                <p>
                  Notre force&nbsp;:{' '}
                  <strong className="text-gray-900">un seul interlocuteur</strong>, une
                  seule facture, et une cohérence garantie entre tous les systèmes.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: '⚡', title: 'Énergie', desc: 'Électricité & solaire' },
                { icon: '🌐', title: 'Réseau', desc: 'Connectivité & informatique' },
                { icon: '🛡️', title: 'Sécurité', desc: 'Vidéosurveillance & accès' },
                { icon: '🏠', title: 'Smart', desc: 'Domotique & automatisation' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white/90"
                >
                  <div className="mb-3 text-3xl">{item.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MISSION / VISION / VALEURS ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-8 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF3FF] to-[#DCEBFF] text-2xl">
                🎯
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {t('mission') || 'Notre mission'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Concevoir, installer et maintenir des infrastructures techniques fiables,
                évolutives et accessibles — de la fourniture d’équipements jusqu’à la
                maintenance sur le long terme.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-8 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF3FF] to-[#E6FBFF] text-2xl">
                🔭
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Notre vision</h3>
              <p className="text-gray-700 leading-relaxed">
                Devenir la référence de l’intégration des bâtiments intelligents au
                Cameroun et en Afrique centrale, en rendant les bâtiments plus sûrs, plus
                connectés, plus autonomes et plus intelligents.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-8 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E6FBFF] to-[#DCEBFF] text-2xl">
                💎
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {t('values') || 'Nos valeurs'}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Fiabilité et conformité aux normes</li>
                <li>• Innovation et technologies éprouvées</li>
                <li>• Proximité et transparence</li>
                <li>• Polyvalence multi-domaines</li>
                <li>• Engagement sur le long terme</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ NOS PÔLES ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t('poles') || 'Nos pôles d’expertise'}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Des domaines complémentaires, un seul partenaire. Chaque pôle est piloté
              par des techniciens spécialisés.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POLES.map((pole) => (
              <Link
                key={pole.slug}
                href={pole.href || `/solutions/${pole.slug}`}
                className={`group rounded-2xl border p-6 backdrop-blur-md transition hover:-translate-y-1 ${
                  pole.highlight
                    ? 'border-[#00C2FF]/50 bg-gradient-to-br from-[#EAF3FF]/90 to-[#E6FBFF]/90 shadow-md shadow-[#00C2FF]/10 hover:border-[#00C2FF] hover:shadow-lg'
                    : 'border-white/70 bg-white/70 shadow-sm shadow-[#0066FF]/5 hover:border-[#0066FF]/40 hover:bg-white/90 hover:shadow-md'
                }`}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0066FF]">
                  {pole.tagline}
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 group-hover:text-[#0066FF]">
                  {pole.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{pole.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium text-[#0066FF] transition group-hover:translate-x-1">
                  En savoir plus →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ CHEFFBUILD CARE (mis en avant) ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="overflow-hidden rounded-3xl border border-[#00C2FF]/40 bg-gradient-to-br from-[#EAF3FF]/90 via-white/80 to-[#E6FBFF]/90 p-8 shadow-xl shadow-[#00C2FF]/10 backdrop-blur-md md:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">
                  Pôle transversal
                </p>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                  CHEFFBUILD CARE
                  <span className="mt-2 block text-lg font-normal text-gray-600">
                    Maintenance & Administration des bâtiments
                  </span>
                </h2>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  Parce qu’un bâtiment intelligent doit le rester dans la durée,
                  <strong className="text-gray-900"> CHEFFBUILD CARE</strong> assure la
                  <strong className="text-gray-900"> maintenance dans tous nos domaines</strong>{' '}
                  et prend en charge la{' '}
                  <strong className="text-gray-900">maintenance générale du bâtiment</strong>,
                  ainsi que son{' '}
                  <strong className="text-gray-900">administration technique</strong>.
                </p>
                <Link
                  href="/care"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-6 py-2.5 font-semibold text-white shadow-md shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Découvrir CARE →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: '🛠️', title: 'Maintenance préventive', desc: 'Contrats d’entretien planifiés.' },
                  { icon: '🚨', title: 'Dépannage rapide', desc: 'Assistance technique continue.' },
                  { icon: '🏢', title: 'Maintenance générale', desc: 'Entretien global du bâtiment.' },
                  { icon: '📋', title: 'Administration technique', desc: 'Suivi documentaire des installations.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/70 bg-white/80 p-5 backdrop-blur-sm"
                  >
                    <div className="mb-2 text-2xl">{item.icon}</div>
                    <h4 className="mb-1 font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ NOTRE APPROCHE ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Notre approche
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Une méthode simple et transparente, du premier contact à la maintenance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: '01', title: 'Audit du besoin', desc: 'Analyse du projet et des contraintes techniques.' },
              { step: '02', title: 'Devis gratuit', desc: 'Proposition transparente sous 24h.' },
              { step: '03', title: 'Installation', desc: 'Conception, pose et mise en service.' },
              { step: '04', title: 'Maintenance', desc: 'Suivi, garantie et assistance continue.' },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#0066FF]/40"
              >
                <div className="mb-3 text-4xl font-bold text-[#0066FF]/40">{item.step}</div>
                <h4 className="mb-2 font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-white/70 bg-white/60 p-10 text-center shadow-xl shadow-[#0066FF]/5 backdrop-blur-md md:p-14">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Un projet&nbsp;? Parlons-en.
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-gray-700">
              Devis gratuit sous 24h. Un interlocuteur unique, une seule facture, une
              cohérence garantie entre tous vos systèmes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/devis"
                className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Demander un devis
              </Link>
              <Link
                href="/configurateur"
                className="rounded-full border border-gray-300 bg-white/80 px-8 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
              >
                Configurer mon projet
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}