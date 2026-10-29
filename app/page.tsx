/* ================================================================== */
/*  APP/PAGE.TSX — PAGE D'ACCUEIL CHEFFBUILD                           */
/*  ------------------------------------------------------------------ */
/*  Page d'accueil complète avec 8 sections :                          */
/*    1. Hero (accroche + CTA + teaser des solutions)                  */
/*    2. Stats (chiffres clés)                                         */
/*    3. Solutions (6 pôles en cards uniformes : 5 solutions + CARE)   */
/*    4. Pourquoi nous (6 arguments différenciants)                    */
/*    5. Réalisations (rotation dynamique 7 catégories)                */
/*    6. Méthode en 4 étapes                                           */
/*    7. Témoignages (3 clients)                                       */
/*    8. CTA final                                                     */
/*                                                                     */
/*  💡 CARE est traité comme les autres : carte dans la grille,        */
/*     mêmes styles, même taille. Pas de bloc séparé.                  */
/* ================================================================== */

import Link from 'next/link';
import {
  FaArrowRight, FaCheckCircle, FaPhoneAlt,
  FaShieldAlt, FaSun, FaNetworkWired, FaHome, FaBolt, FaCog,
  FaClock, FaAward, FaUsers, FaTools, FaQuoteLeft,
} from 'react-icons/fa';
import HomeRealisations from '@/components/HomeRealisations';
import { SOLUTIONS } from '@/lib/solutions';

/* ================================================================== */
/*  DONNÉES STATIQUES DE LA PAGE                                       */
/* ================================================================== */

/* --- Stats --- */
const STATS = [
  { value: '150+', label: 'Projets livrés', icon: FaAward },
  { value: '10', label: 'Régions couvertes', icon: FaUsers },
  { value: '24h', label: 'Devis gratuit', icon: FaClock },
  { value: '12', label: 'Mois de garantie', icon: FaShieldAlt },
];

/* --- Pourquoi nous choisir --- */
const WHY_US = [
  {
    icon: '🎯',
    title: 'Un seul interlocuteur',
    desc: "Un chef de projet dédié coordonne tous les corps de métier. Vous ne gérez qu'un seul contact.",
  },
  {
    icon: '📋',
    title: 'Une seule facture',
    desc: 'Fini les devis multiples et les prestataires qui se renvoient la balle. Un contrat clair, un prix juste.',
  },
  {
    icon: '🔗',
    title: 'Compatibilité garantie',
    desc: 'Tous nos systèmes communiquent entre eux : électricité, réseau, sécurité, domotique, automatisation.',
  },
  {
    icon: '🛡️',
    title: 'Fiabilité éprouvée',
    desc: '150+ projets livrés, 12 mois de garantie, contrats de maintenance sur option.',
  },
  {
    icon: '⚡',
    title: 'Réactivité 24/7',
    desc: "Support technique continu, dépannage prioritaire, intervention rapide en cas d'urgence.",
  },
  {
    icon: '🌍',
    title: 'Ancrage camerounais',
    desc: 'Équipe locale, matériel disponible au Cameroun, intervention dans les 10 régions.',
  },
];

/* --- Méthode en 4 étapes --- */
const PROCESS = [
  { step: '01', title: 'Audit du besoin', desc: 'Visite technique gratuite, analyse de vos contraintes et de vos objectifs.' },
  { step: '02', title: 'Devis détaillé', desc: 'Proposition transparente sous 24h, ligne par ligne, sans surprise.' },
  { step: '03', title: 'Installation', desc: 'Conception, pose, câblage et mise en service par nos techniciens certifiés.' },
  { step: '04', title: 'Maintenance', desc: 'Suivi, garantie 12 mois et contrats CARE pour durer dans le temps.' },
];

/* --- Témoignages --- */
const TESTIMONIALS = [
  {
    name: 'M. Ngono',
    role: 'Propriétaire de villa, Yaoundé',
    text: "CHEFFBUILD a géré toute l'électricité, le solaire et la domotique de ma villa en un seul contrat. Résultat impeccable, équipe très pro.",
    rating: 5,
  },
  {
    name: 'Mme Tchouamo',
    role: 'Directrice, PME à Douala',
    text: 'Notre réseau et notre vidéosurveillance ont été refaits en 2 semaines. Zéro interruption pendant les travaux. Je recommande vivement.',
    rating: 5,
  },
  {
    name: 'M. Fotso',
    role: 'Promoteur immobilier, Bafoussam',
    text: "Un seul interlocuteur pour tous les lots techniques de mes immeubles. C'est exactement ce que je cherchais depuis des années.",
    rating: 5,
  },
];

/* ================================================================== */
/*  COMPOSANT PAGE D'ACCUEIL                                           */
/* ================================================================== */
export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">

      {/* ============ FOND DYNAMIQUE GLOBAL ============ */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 right-1/4 h-[450px] w-[450px] rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  1. HERO                                                     */}
      {/* ============================================================ */}
      <section className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Texte */}
            <div>
              <span className="mb-5 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
                CHEFFBUILD Smart Systems
              </span>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Connecter, sécuriser et{' '}
                <span className="animate-gradient bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#0066FF] bg-clip-text text-transparent">
                  automatiser
                </span>{' '}
                vos bâtiments
              </h1>
              <p className="mb-8 max-w-xl text-lg text-gray-700 md:text-xl">
                Intégrateur camerounais de solutions techniques du bâtiment.
                Un seul partenaire pour l'électricité, le solaire, le réseau,
                la sécurité, la domotique et l'automatisation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/devis"
                  className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Demander un devis
                </Link>
                <Link
                  href="/solutions"
                  className="rounded-full border border-gray-300 bg-white/80 px-8 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
                >
                  Découvrir nos solutions
                </Link>
              </div>
              {/* Badges de réassurance */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#00C2FF]" size={14} /> Devis gratuit
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#00C2FF]" size={14} /> Réponse sous 24h
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#00C2FF]" size={14} /> Garantie 12 mois
                </span>
              </div>
            </div>

            {/* Visuel : grille des 5 solutions (CARE est dans la grille principale, pas ici) */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                {SOLUTIONS.slice(0, 4).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/solutions/${s.slug}`}
                    className={`group rounded-2xl border-2 bg-white/70 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl ${s.colors.border}`}
                  >
                    <div className="mb-2 text-3xl">{s.icon}</div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      {s.tagline}
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900 group-hover:text-[#0066FF]">
                      {s.name.replace('CHEFFBUILD ', '')}
                    </div>
                  </Link>
                ))}
              </div>
              {SOLUTIONS[4] && (
                <Link
                  href={`/solutions/${SOLUTIONS[4].slug}`}
                  className={`group mt-3 flex items-center gap-4 rounded-2xl border-2 bg-white/70 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl ${SOLUTIONS[4].colors.border}`}
                >
                  <span className="text-4xl">{SOLUTIONS[4].icon}</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      {SOLUTIONS[4].tagline}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {SOLUTIONS[4].name.replace('CHEFFBUILD ', '')}
                    </div>
                  </div>
                </Link>
              )}
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#0066FF]">
                  Intégrateur
                </div>
                <div className="text-sm font-medium text-gray-900">Tous les lots techniques</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. STATS                                                    */}
      {/* ============================================================ */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:shadow-md"
                >
                  <Icon className="mb-3 text-[#0066FF]" size={20} />
                  <div className="text-3xl font-bold text-[#0066FF] md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-700">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. SOLUTIONS (6 pôles : 5 solutions + CARE en uniforme)     */}
      {/* ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
              Nos solutions
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Six domaines,{' '}
              <span className="animate-gradient bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                un seul partenaire
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Tous les lots techniques de votre bâtiment, conçus, installés et
              maintenus par une seule équipe.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Les 5 solutions existantes */}
            {SOLUTIONS.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className={`group rounded-2xl border-2 bg-white/70 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl md:p-8 ${solution.colors.border}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-5xl">{solution.icon}</div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${solution.colors.badge}`}
                  >
                    {solution.tagline}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-[#0066FF]">
                  {solution.name}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {solution.shortDesc}
                </p>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${solution.colors.accent} transition-all group-hover:gap-2`}>
                  En savoir plus <FaArrowRight size={10} />
                </span>
              </Link>
            ))}

            {/* 6e card : CARE — même style, même taille, pas de mise en avant */}
            <Link
              href="/care"
              className="group rounded-2xl border-2 border-emerald-300 bg-white/70 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-white/90 hover:shadow-xl hover:shadow-emerald-500/20 md:p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-5xl">🔧</div>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                  Maintenance
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-emerald-600">
                CHEFFBUILD CARE
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Maintenance dans tous nos domaines, maintenance générale du bâtiment
                et administration technique — un contrat unique.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-500 transition-all group-hover:gap-2">
                En savoir plus <FaArrowRight size={10} />
              </span>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-8 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
            >
              Voir toutes les solutions <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. POURQUOI CHEFFBUILD                                      */}
      {/* ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
              Pourquoi nous choisir
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Ce qui nous{' '}
              <span className="animate-gradient bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                différencie
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Six engagements concrets qui font la différence sur chaque projet.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#0066FF]/40 hover:bg-white/90 hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. NOS RÉALISATIONS (rotation dynamique)                    */}
      {/* ============================================================ */}
      <div className="relative z-10">
        <HomeRealisations />
      </div>

      {/* ============================================================ */}
      {/*  6. MÉTHODE EN 4 ÉTAPES                                      */}
      {/* ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
              Notre méthode
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Simple, transparent,{' '}
              <span className="animate-gradient bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                efficace
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Du premier contact à la maintenance, en 4 étapes claires.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md"
              >
                <div className="mb-3 text-4xl font-bold text-[#0066FF]/40">
                  {step.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. TÉMOIGNAGES                                              */}
      {/* ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
              Témoignages
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Ils nous font{' '}
              <span className="animate-gradient bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">
                confiance
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Ce que nos clients disent de nous après leur projet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur-md"
              >
                <FaQuoteLeft className="mb-3 text-[#00C2FF]/40" size={24} />
                <p className="mb-5 text-sm leading-relaxed text-gray-700 italic">
                  « {t.text} »
                </p>
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. CTA FINAL                                                */}
      {/* ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] p-10 text-center text-white shadow-xl shadow-[#0066FF]/20 md:p-14">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Prêt à démarrer votre projet&nbsp;?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
              Devis gratuit sous 24h. Un interlocuteur unique, une seule facture,
              une cohérence garantie entre tous vos systèmes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/devis"
                className="rounded-lg bg-white px-8 py-3 font-bold text-[#0066FF] shadow-xl transition hover:-translate-y-0.5 hover:bg-gray-100"
              >
                Demander un devis
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <FaPhoneAlt size={12} /> Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}