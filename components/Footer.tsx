import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

const QUICK_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/care', label: 'CHEFFBUILD CARE' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-cyan-500/20 bg-[url('/images/backgroundfooter.png')] bg-cover bg-center text-white">
      {/* ============ EFFETS DE FOND (restaurés) ============ */}
      <div className="absolute inset-0 bg-[#072660] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00BFFF,transparent_35%)] opacity-10" />
      <div className="absolute inset-0 bg-[url('/images/circuit-pattern.png')] bg-cover bg-center opacity-5" />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* ============ Colonne 1 — Logo + Brand ============ */}
          <div>
            <Link href="/" className="mb-2 flex items-center gap-2.5">
              {/* --- SOLUTION 1 : Badge CB (fonctionne tout de suite) --- */}
             

              {
              <Image
                src="/images/logo1.png"
                alt="CHEFFBUILD Logo"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-lg object-contain"
              />
              }

              <div>
                <div className="text-base font-bold leading-tight">
                  <span className="text-white">CHEFFBUILD</span>
                </div>
                <div className="text-[11px] font-semibold text-cyan-400">
                  Smart Systems
                </div>
              </div>
            </Link>

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Connecter • Sécuriser • Automatiser
            </p>
            <p className="mb-3 text-xs leading-relaxed text-gray-300">
              Intégrateur camerounais de solutions techniques du bâtiment : électricité,
              solaire, réseau, sécurité, domotique et automatisation.
            </p>

            {/* Réseaux sociaux compacts */}
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/237697654023"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-white/5 text-cyan-400 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-[#072660]"
              >
                <FaWhatsapp size={13} />
              </a>
              <a
                href="https://t.me/Dan_Cheff"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-white/5 text-cyan-400 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-[#072660]"
              >
                <FaTelegramPlane size={13} />
              </a>
              <a
                href="mailto:dancheffo29@gmail.com"
                aria-label="Email"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-white/5 text-cyan-400 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-[#072660]"
              >
                <MdEmail size={13} />
              </a>
              <a
                href="tel:+237697654023"
                aria-label="Téléphone"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-white/5 text-cyan-400 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-[#072660]"
              >
                <MdPhone size={13} />
              </a>
            </div>
          </div>

          {/* ============ Colonne 2 — Liens rapides ============ */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Liens rapides
            </h4>
            <ul className="space-y-1.5 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ Colonne 3 — QR Codes centrés ============ */}
          <div>
            <h4 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Scanner & connecter
            </h4>

            <div className="flex justify-center gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-white p-1 shadow-md">
                  <Image
                    src="/images/qr/contact.jpg"
                    alt="QR code contact CHEFFBUILD"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] leading-tight text-gray-400">
                  Contact
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-white p-1 shadow-md">
                  <Image
                    src="/images/qr/portfolio.jpg"
                    alt="QR code portfolio CHEFFBUILD"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-1.5 text-center text-[10px] leading-tight text-gray-400">
                  Portfolio
                </p>
              </div>
            </div>
          </div>

          {/* ============ Colonne 4 — Contact + CTA ============ */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Contact
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="tel:+237697654023"
                className="flex items-center gap-2 text-gray-300 transition hover:text-cyan-400"
              >
                <MdPhone size={14} className="shrink-0 text-cyan-400" />
                +237 697 654 023
              </a>
              <a
                href="mailto:dancheffo29@gmail.com"
                className="flex items-center gap-2 text-gray-300 transition hover:text-cyan-400"
              >
                <MdEmail size={14} className="shrink-0 text-cyan-400" />
                dancheffo29@gmail.com
              </a>
              <a
                href="https://wa.me/237697654023"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 transition hover:text-green-400"
              >
                <FaWhatsapp size={14} className="shrink-0 text-green-400" />
                WhatsApp
              </a>
            </div>

            <div className="mt-3 space-y-1.5">
              <Link
                href="/devis"
                className="block rounded-md bg-cyan-400 px-3 py-2 text-center text-[11px] font-bold text-[#072660] transition hover:bg-cyan-300"
              >
                DEMANDER UN DEVIS
              </Link>
              <Link
                href="/configurateur"
                className="block rounded-md border border-cyan-400/60 px-3 py-2 text-center text-[11px] font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-[#072660]"
              >
                CONFIGURER MON PROJET
              </Link>
            </div>
          </div>
        </div>

        {/* ============ Bottom bar ============ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-[11px] text-gray-400 md:flex-row">
          <p>© {new Date().getFullYear()} CHEFFBUILD Smart Systems. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-cyan-400">
              Confidentialité
            </Link>
            <Link href="/mentions" className="transition hover:text-cyan-400">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}