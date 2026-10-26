'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CONTACT_INFO = [
  {
    icon: '📞',
    label: 'Téléphone',
    value: '+237 697 654 023',
    href: 'tel:+237697654023',
    cta: 'Appeler',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+237 697 654 023',
    href: 'https://wa.me/237697654023',
    cta: 'Discuter',
    external: true,
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'dancheffo29@gmail.com',
    href: 'mailto:dancheffo29@gmail.com',
    cta: 'Écrire',
  },
  {
    icon: '📍',
    label: 'Localisation',
    value: 'Yaoundé / Douala, Cameroun',
    href: 'https://maps.google.com/?q=Yaound%C3%A9,Cameroun',
    cta: 'Voir sur la carte',
    external: true,
  },
];

const HOURS = [
  { day: 'Lundi – Vendredi', time: '08h00 – 18h00' },
  { day: 'Samedi', time: '09h00 – 13h00' },
  { day: 'Dimanche', time: 'Fermé' },
];

const SUBJECTS = [
  { value: 'devis', label: 'Demande de devis' },
  { value: 'care', label: 'CHEFFBUILD CARE (maintenance)' },
  { value: 'boutique', label: 'Commande / Boutique' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'devis',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l’envoi');

      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: 'devis', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF] text-gray-900">
      {/* ============================================================ */}
      {/* ============ FOND DYNAMIQUE (décor animé) ================= */}
      {/* ============================================================ */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Orbes flottants (blob) */}
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/4 -left-40 h-[420px] w-[420px] rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 right-1/3 h-[450px] w-[450px] rounded-full bg-[#7C3AED]/10 blur-3xl" />

        {/* Grille de points subtile */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Réseau de liaisons SVG (dynamique) */}
        <svg
          className="absolute inset-0 h-full w-full opacity-60"
          viewBox="0 0 1200 1600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Lignes en pointillés animées (effet data-flow) */}
          <g stroke="url(#link-grad)" strokeWidth="1.5" fill="none" strokeDasharray="4 6">
            <path className="animate-dash" d="M150,200 Q350,120 550,280 T950,220" />
            <path className="animate-dash animation-delay-2000" d="M80,600 Q300,500 600,650 T1050,580" />
            <path className="animate-dash animation-delay-4000" d="M200,1000 Q400,900 700,1050 T1100,980" />
            <path className="animate-dash" d="M120,1400 Q350,1300 650,1450 T1000,1380" />
          </g>

          {/* Nœuds pulsants (points de connexion) */}
          <g fill="#0066FF">
            <circle cx="150" cy="200" r="4" className="animate-pulse" />
            <circle cx="550" cy="280" r="3" className="animate-pulse animation-delay-2000" />
            <circle cx="950" cy="220" r="4" className="animate-pulse animation-delay-4000" />
            <circle cx="600" cy="650" r="3" className="animate-pulse" />
            <circle cx="1050" cy="580" r="4" className="animate-pulse animation-delay-2000" />
            <circle cx="700" cy="1050" r="3" className="animate-pulse animation-delay-4000" />
            <circle cx="650" cy="1450" r="4" className="animate-pulse" />
            <circle cx="1100" cy="980" r="3" className="animate-pulse animation-delay-2000" />
          </g>
        </svg>
      </div>

      {/* ============================================================ */}
      {/* ============ CONTENU (au-dessus du décor) ================= */}
      {/* ============================================================ */}
      <div className="relative z-10">
        {/* ============ HERO ============ */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <span className="mb-5 inline-block rounded-full border border-[#0066FF]/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF] backdrop-blur-md">
            Contact
          </span>
          <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Parlons de votre{' '}
            <span className="animate-gradient bg-gradient-to-r from-[#0066FF] via-[#00C2FF] to-[#0066FF] bg-clip-text text-transparent">
              projet
            </span>
          </h1>
          <p className="max-w-3xl text-lg text-gray-700 md:text-xl">
            Devis gratuit sous 24h. Un interlocuteur unique, une réponse rapide,
            des solutions sur mesure pour votre bâtiment.
          </p>
        </section>

        {/* ============ FORM + INFOS ============ */}
        <section className="container mx-auto px-4 pb-16 md:pb-20">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            {/* --- Coordonnées --- */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
                Nos coordonnées
              </h2>

              <div className="space-y-3">
                {CONTACT_INFO.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-4 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white/90 hover:shadow-lg hover:shadow-[#0066FF]/10"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF3FF] to-[#DCEBFF] text-xl shadow-inner">
                      {c.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#0066FF]">
                        {c.label}
                      </div>
                      <div className="mt-1 font-medium text-gray-900">{c.value}</div>
                    </div>
                    <span className="self-center text-sm font-medium text-[#0066FF] transition group-hover:translate-x-1">
                      {c.cta} →
                    </span>
                  </a>
                ))}
              </div>

              {/* Horaires */}
              <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm shadow-[#0066FF]/5 backdrop-blur-md">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E6FBFF] to-[#DCEBFF] text-base">
                    🕐
                  </span>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {HOURS.map((h) => (
                    <li key={h.day} className="flex justify-between text-gray-700">
                      <span>{h.day}</span>
                      <span className="font-semibold text-gray-900">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/237697654023"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:-translate-y-0.5 hover:bg-[#1ebe57] hover:shadow-xl hover:shadow-[#25D366]/40"
              >
                <span className="text-xl">💬</span>
                Discuter sur WhatsApp
              </a>
            </div>

            {/* --- Formulaire --- */}
            <div className="lg:col-span-3">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
                Envoyez-nous un message
              </h2>

              {status === 'success' ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center shadow-lg shadow-emerald-500/10 backdrop-blur-md">
                  <div className="mb-3 text-5xl">✅</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Message envoyé !</h3>
                  <p className="text-gray-700">
                    Merci pour votre message. Nous vous répondrons sous 24h.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 rounded-full border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 rounded-2xl border border-white/70 bg-white/70 p-6 shadow-lg shadow-[#0066FF]/5 backdrop-blur-md md:p-8"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-800">
                        Nom complet *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/80 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/80 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                        placeholder="vous@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-800">
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/80 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                        placeholder="+237 ..."
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-800">
                        Sujet *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/80 bg-white/90 px-4 py-3 text-gray-900 shadow-sm transition focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-800">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full resize-none rounded-lg border border-white/80 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                      placeholder="Décrivez votre projet en quelques lignes..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="rounded-lg border border-red-200 bg-red-50/90 p-3 text-sm text-red-700 backdrop-blur">
                      ❌ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0066FF]/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>

                  <p className="text-center text-xs text-gray-600">
                    * Champs obligatoires. Vos données ne sont jamais partagées.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ============ QR CODES ============ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Scannez & connectez-vous
            </h2>
            <p className="mx-auto max-w-2xl text-gray-700">
              Un scan suffit pour nous contacter directement ou découvrir nos réalisations.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* QR Contact */}
            <div className="group flex flex-col items-center rounded-2xl border border-white/70 bg-white/70 p-8 shadow-lg shadow-[#0066FF]/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#0066FF]/40 hover:bg-white/90 hover:shadow-xl hover:shadow-[#0066FF]/10">
              <div className="mb-4 flex h-44 w-44 items-center justify-center rounded-xl border border-white/80 bg-white p-3 shadow-md">
                <Image
                  src="/images/qr/contact.jpg"
                  alt="QR code contact CHEFFBUILD"
                  width={160}
                  height={160}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">Contact direct</h3>
              <p className="mb-4 text-center text-sm text-gray-700">
                Scannez pour nous appeler ou discuter sur WhatsApp.
              </p>
              <a
                href="https://wa.me/237697654023"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#0066FF] hover:underline"
              >
                Ou cliquez ici →
              </a>
            </div>

            {/* QR Portfolio */}
            <div className="group flex flex-col items-center rounded-2xl border border-white/70 bg-white/70 p-8 shadow-lg shadow-[#0066FF]/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#00C2FF]/50 hover:bg-white/90 hover:shadow-xl hover:shadow-[#00C2FF]/10">
              <div className="mb-4 flex h-44 w-44 items-center justify-center rounded-xl border border-white/80 bg-white p-3 shadow-md">
                <Image
                  src="/images/qr/portfolio.jpg"
                  alt="QR code portfolio CHEFFBUILD"
                  width={160}
                  height={160}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">Notre portfolio</h3>
              <p className="mb-4 text-center text-sm text-gray-700">
                Scannez pour découvrir nos réalisations et projets.
              </p>
              <Link
                href="/realisations"
                className="text-sm font-semibold text-[#0066FF] hover:underline"
              >
                Ou cliquez ici →
              </Link>
            </div>
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-white/70 bg-white/60 p-10 text-center shadow-xl shadow-[#0066FF]/5 backdrop-blur-md md:p-14">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Pas encore prêt à nous écrire&nbsp;?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-gray-700">
              Configurez votre projet en quelques minutes et obtenez une estimation
              budgétaire immédiate.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/configurateur"
                className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-8 py-3 font-semibold text-white shadow-lg shadow-[#0066FF]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0066FF]/40"
              >
                Configurer mon projet
              </Link>
              <Link
                href="/devis"
                className="rounded-full border border-gray-300 bg-white/80 px-8 py-3 font-semibold text-gray-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#0066FF]/40 hover:bg-white"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ============ WHATSAPP FLOTTANT ============ */}
      <a
        href="https://wa.me/237697654023"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter CHEFFBUILD sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-110 hover:bg-[#1ebe57]"
      >
        💬
      </a>
    </div>
  );
}