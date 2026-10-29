/* ================================================================== */
/*  COMPONENTS/SOLUTIONDETAIL.TSX                                      */
/*  ------------------------------------------------------------------ */
/*  Composant partagé pour afficher les détails d'une solution.         */
/*  Il est utilisé par app/solutions/[category]/page.tsx.               */
/*  ----------------------------------------------------------------    */
/*  💡 Ce composant est 100% data-driven : il ne connaît pas à l'avance */
/*  quelle solution il affiche. Tout vient du prop `solution`.          */
/* ================================================================== */

import Link from 'next/link';
import {
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaPhoneAlt,
} from 'react-icons/fa';
import type { Solution } from '@/lib/solutions';

type Props = {
  solution: Solution;
};

export default function SolutionDetail({ solution }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">

      {/* ============ FOND DYNAMIQUE ============ */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10">

        {/* ============ BREADCRUMB ============ */}
        <div className="container mx-auto px-4 pt-8">
          <nav className="flex items-center gap-2 text-xs text-gray-600">
            <Link href="/" className="hover:text-[#0066FF]">Accueil</Link>
            <span>/</span>
            <Link href="/solutions" className="hover:text-[#0066FF]">Solutions</Link>
            <span>/</span>
            <span className="text-gray-900">{solution.name}</span>
          </nav>
        </div>

        {/* ============ HERO ============ */}
        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Texte à gauche */}
            <div>
              <span
                className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-md ${solution.colors.badge}`}
              >
                <span className="text-base">{solution.icon}</span>
                {solution.tagline}
              </span>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
                {solution.name}
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {solution.shortDesc}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/devis"
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${solution.colors.gradient} px-7 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5`}
                >
                  {solution.ctaText} <FaArrowRight size={12} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-7 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
                >
                  <FaPhoneAlt size={12} /> Nous contacter
                </Link>
              </div>
            </div>

            {/* Carte visuelle à droite */}
            <div className={`relative rounded-3xl border-2 ${solution.colors.border} bg-white/70 p-8 backdrop-blur-md md:p-10`}>
              <div className={`absolute inset-0 rounded-3xl ${solution.colors.softBg} opacity-60`} />
              <div className="relative">
                <div className="mb-6 text-7xl text-center">{solution.icon}</div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 text-center">
                  {solution.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 text-center">
                  {solution.longDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ NOS SERVICES ============ */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Nos services
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Tout ce que nous pouvons faire pour vous dans le domaine {solution.tagline.toLowerCase()}.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solution.services.map((service) => (
              <div
                key={service.title}
                className={`group rounded-2xl border-2 ${solution.colors.border} bg-white/70 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg`}
              >
                <div className="mb-3 text-3xl">{service.icon}</div>
                <h3 className="mb-2 font-bold text-gray-900 group-hover:text-[#0066FF]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ POURQUOI NOUS CHOISIR ============ */}
        <section className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-lg shadow-[#0066FF]/5 backdrop-blur-md md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
                  Pourquoi choisir {solution.name} ?
                </h2>
                <p className="mb-6 text-gray-700">
                  Nos engagements pour votre tranquillité :
                </p>
                <ul className="space-y-3">
                  {solution.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <FaCheckCircle
                        className={`mt-0.5 shrink-0 ${solution.colors.accent}`}
                        size={18}
                      />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '150+', label: 'Projets livrés' },
                  { value: '24h', label: 'Devis gratuit' },
                  { value: '12', label: 'Mois de garantie' },
                  { value: '24/7', label: 'Support' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-gray-200 bg-white p-5 text-center"
                  >
                    <div className={`text-2xl font-bold ${solution.colors.accent} md:text-3xl`}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ NOTRE MÉTHODE (process 4 étapes) ============ */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Notre méthode
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Un parcours simple et transparent, du premier contact à la maintenance.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {solution.process.map((step) => (
              <div
                key={step.step}
                className={`rounded-2xl border-2 ${solution.colors.border} bg-white/70 p-6 backdrop-blur-md`}
              >
                <div className={`mb-3 text-4xl font-bold ${solution.colors.accent} opacity-40`}>
                  {step.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="container mx-auto px-4 py-16 pb-20">
          <div className={`rounded-3xl bg-gradient-to-br ${solution.colors.gradient} p-10 text-center text-white shadow-xl md:p-14`}>
            <div className="mb-4 text-5xl">{solution.icon}</div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/90">
              Devis gratuit sous 24h. Un interlocuteur unique, une seule facture, une
              cohérence garantie entre tous vos systèmes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/devis"
                className="rounded-lg bg-white px-8 py-3 font-bold text-gray-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-gray-100"
              >
                {solution.ctaText}
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-8 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <FaArrowLeft size={12} /> Toutes les solutions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}