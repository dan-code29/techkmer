'use client';

import Link from 'next/link';

const SERVICES = [
  {
    icon: '🛠️',
    title: 'Maintenance préventive',
    desc: 'Contrats d’entretien planifiés sur l’ensemble de vos systèmes : électricité, solaire, réseau, sécurité, domotique et automatisation.',
  },
  {
    icon: '🚨',
    title: 'Dépannage & maintenance curative',
    desc: 'Intervention rapide en cas de panne, diagnostic technique et remise en service de vos installations dans les meilleurs délais.',
  },
  {
    icon: '🏢',
    title: 'Maintenance générale du bâtiment',
    desc: 'Entretien global de vos installations techniques et des équipements du bâtiment, pour préserver leur performance et leur durée de vie.',
  },
  {
    icon: '📋',
    title: 'Administration technique',
    desc: 'Gestion, suivi documentaire et traçabilité de toutes vos installations : registres, historique d’interventions, mise à jour des plans.',
  },
  {
    icon: '📞',
    title: 'Assistance 24/7',
    desc: 'Support technique continu, hotline dédiée et escalade rapide vers un technicien spécialisé en cas d’urgence.',
  },
  {
    icon: '📊',
    title: 'Audit & optimisation',
    desc: 'Audit de performance de vos systèmes, recommandations d’amélioration et plan de modernisation sur mesure.',
  },
];

const DOMAINS = [
  'Électricité', 'Solaire', 'Réseau', 'Sécurité',
  'Domotique', 'Automatisation', 'Plomberie technique',
  'Climatisation', 'Groupe électrogène',
];

const REALISATIONS = [
  {
    icon: '🏘️',
    gradient: 'from-[#0066FF]/30 to-[#00C2FF]/10',
    title: 'Contrat de maintenance — Résidence R+2',
    location: 'Yaoundé, Bastos',
    scope: ['Électricité', 'Solaire', 'Sécurité'],
    desc: 'Contrat annuel de maintenance préventive couvrant l’installation électrique, les panneaux solaires et le système de vidéosurveillance d’une résidence de 6 appartements.',
  },
  {
    icon: '🏢',
    gradient: 'from-[#00C2FF]/30 to-[#0066FF]/10',
    title: 'Administration technique — Immeuble de bureaux',
    location: 'Douala, Bonanjo',
    scope: ['Réseau', 'Domotique', 'Maintenance générale'],
    desc: 'Prise en charge de l’administration technique complète du bâtiment : gestion des interventions, registres, coordination des prestataires et suivi des équipements.',
  },
  {
    icon: '🏬',
    gradient: 'from-emerald-500/30 to-[#00C2FF]/10',
    title: 'Dépannage & remise en service — Commerce',
    location: 'Douala, Akwa',
    scope: ['Électricité', 'Automatisation'],
    desc: 'Intervention d’urgence sur un système d’automatisation de portail défaillant, remise en service et mise en place d’un contrat d’entretien préventif.',
  },
  {
    icon: '🏫',
    gradient: 'from-purple-500/30 to-[#0066FF]/10',
    title: 'Maintenance multi-sites — Institution',
    location: 'Yaoundé + Douala',
    scope: ['Réseau', 'Sécurité', 'Maintenance générale'],
    desc: 'Contrat de maintenance multi-sites couvrant les installations réseau, la vidéosurveillance et l’entretien général de plusieurs bâtiments institutionnels.',
  },
];

const STEPS = [
  { step: '01', title: 'Audit initial', desc: 'Visite technique et état des lieux complet de vos installations.' },
  { step: '02', title: 'Contrat sur mesure', desc: 'Proposition adaptée à vos besoins, votre budget et la criticité de vos systèmes.' },
  { step: '03', title: 'Suivi régulier', desc: 'Interventions planifiées, rapports d’entretien et assistance continue.' },
  { step: '04', title: 'Optimisation', desc: 'Recommandations d’amélioration et mise à niveau progressive de vos équipements.' },
];

export default function CarePage() {
  return (
    <div className="bg-[#050B16] text-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050B16] via-[#0A1428] to-[#050B16]" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#00C2FF]/10 blur-3xl" />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            Maintenance • Administration • Suivi
          </p>
          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            CHEFFBUILD <span className="text-[#00C2FF]">CARE</span>
          </h1>
          <p className="max-w-3xl text-lg text-gray-300 md:text-xl">
            Un bâtiment intelligent doit le rester dans la durée. CARE assure la
            maintenance dans tous nos domaines, la maintenance générale du bâtiment
            et son administration technique — sous un seul contrat.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/devis"
              className="rounded-full bg-[#0066FF] px-8 py-3 font-semibold text-white transition hover:bg-[#0052cc]"
            >
              Demander un contrat
            </Link>
            <a
              href="https://wa.me/237697654023"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      {/* ============ POURQUOI CARE ============ */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: '🔒', title: 'Continuité de service', desc: 'Vos systèmes restent opérationnels, année après année.' },
            { icon: '💰', title: 'Maîtrise des coûts', desc: 'Un contrat clair, prévisible, sans surprises.' },
            { icon: '🎯', title: 'Un seul interlocuteur', desc: 'Tous vos lots techniques gérés par une seule équipe.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-[#0066FF]/50 hover:bg-white/[0.05]"
            >
              <div className="mb-4 text-3xl">{item.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nos services de maintenance</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Une couverture complète, du dépannage ponctuel au contrat annuel
              multi-domaines.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/10 bg-[#050B16] p-6 transition hover:-translate-y-1 hover:border-[#0066FF]/60"
              >
                <div className="mb-3 text-3xl">{s.icon}</div>
                <h3 className="mb-2 font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOMAINES COUVERTS ============ */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Domaines couverts</h2>
          <p className="mb-8 text-gray-400">
            CARE intervient sur l’ensemble des systèmes techniques que nous installons
            et au-delà.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {DOMAINS.map((d) => (
              <span
                key={d}
                className="rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 px-4 py-2 text-sm font-medium text-[#00C2FF]"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RÉALISATIONS ============ */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nos réalisations</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Quelques exemples de contrats et interventions CARE.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {REALISATIONS.map((r) => (
              <div
                key={r.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#050B16] transition hover:border-[#0066FF]/60"
              >
                <div className={`relative h-40 bg-gradient-to-br ${r.gradient}`}>
                  <div className="absolute top-4 right-4 text-4xl">{r.icon}</div>
                  <div className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white/80">
                    {r.location}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-white group-hover:text-[#00C2FF]">
                    {r.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-400">{r.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {r.scope.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ces exemples sont illustratifs. Remplace-les par tes vraies réalisations
            dans le tableau <code className="text-[#00C2FF]">REALISATIONS</code>.
          </p>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Comment ça marche&nbsp;?</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Un parcours simple, transparent, du premier audit au suivi continu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="mb-3 text-4xl font-bold text-[#0066FF]/40">{item.step}</div>
              <h4 className="mb-2 font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-white/10 bg-gradient-to-br from-[#0066FF]/20 via-[#050B16] to-[#00C2FF]/10 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Protégez vos installations.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Devis gratuit sous 24h. Un contrat adapté à votre bâtiment, un
            interlocuteur unique, un suivi durable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/devis"
              className="rounded-full bg-[#0066FF] px-8 py-3 font-semibold text-white transition hover:bg-[#0052cc]"
            >
              Demander un devis CARE
            </Link>
            <Link
              href="/realisations"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Voir toutes nos réalisations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}