/* ================================================================== */
/*  APP/SOLUTIONS/PAGE.TSX                                             */
/*  ------------------------------------------------------------------ */
/*  Page listing qui affiche les 5 solutions sous forme de cards       */
/*  colorées, avec un lien vers chaque page détail.                    */
/* ================================================================== */

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { SOLUTIONS } from '@/lib/solutions';

export const metadata = {
  title: 'Nos solutions techniques | CHEFFBUILD',
  description:
    'Découvrez les 5 pôles d’expertise CHEFFBUILD : électricité, réseau, domotique, sécurité et automatisation.',
};

export default function SolutionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">

      {/* ============ FOND DYNAMIQUE ============ */}
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

      <div className="relative z-10">

        {/* ============ HERO ============ */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <span className="mb-5 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
            Nos solutions
          </span>
          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Cinq domaines, un seul{' '}
            <span className="animate-gradient bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#0066FF] bg-clip-text text-transparent">
              partenaire
            </span>
          </h1>
          <p className="max-w-3xl text-lg text-gray-700 md:text-xl">
            De l’électricité au solaire, du réseau à la domotique, de la sécurité à
            l’automatisation — CHEFFBUILD couvre tous les lots techniques de votre
            bâtiment.
          </p>
        </section>

        {/* ============ GRILLE DES SOLUTIONS ============ */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className={`group overflow-hidden rounded-2xl border-2 bg-white/70 p-6 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl md:p-8 ${solution.colors.border}`}
              >
                {/* Icône + tagline */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-5xl">{solution.icon}</div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md ${solution.colors.badge}`}
                  >
                    {solution.tagline}
                  </span>
                </div>

                {/* Nom */}
                <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-[#0066FF]">
                  {solution.name}
                </h2>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {solution.shortDesc}
                </p>

                {/* Liste des services (max 3 pour garder compact) */}
                <ul className="mb-5 space-y-1.5">
                  {solution.services.slice(0, 3).map((s) => (
                    <li key={s.title} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="shrink-0">{s.icon}</span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`inline-flex items-center gap-1 text-sm font-semibold ${solution.colors.accent} transition-all group-hover:gap-2`}>
                  En savoir plus <FaArrowRight size={10} />
                </div>
              </Link>
            ))}

            {/* Carte spéciale CARE (renvoie vers /care) */}
            <Link
              href="/care"
              className="group overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white/70 p-6 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-white/90 hover:shadow-xl md:p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-5xl">🔧</div>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                  Maintenance
                </span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-emerald-600">
                CHEFFBUILD CARE
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Maintenance dans tous nos domaines, maintenance générale du bâtiment et administration technique — un contrat unique.
              </p>
              <ul className="mb-5 space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="shrink-0">🛠️</span>
                  <span>Maintenance préventive</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="shrink-0">🚨</span>
                  <span>Dépannage rapide</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="shrink-0">📋</span>
                  <span>Administration technique</span>
                </li>
              </ul>
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2">
                Découvrir CARE <FaArrowRight size={10} />
              </div>
            </Link>
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-white/70 bg-white/60 p-10 text-center shadow-xl shadow-[#0066FF]/5 backdrop-blur-md md:p-14">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Un projet multi-domaines ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-gray-700">
              Un seul interlocuteur pour tous vos lots techniques. Cohérence et
              simplicité garanties.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/devis"
                className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5"
              >
                Demander un devis
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-gray-300 bg-white/80 px-8 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}