'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import {
  FaBolt, FaSun, FaNetworkWired, FaShieldAlt, FaHome,
  FaDoorOpen, FaArrowRight, FaCheckCircle, FaWhatsapp,
  FaFileAlt, FaTools, FaCog,
} from 'react-icons/fa';

// ============================================================================
//  PAGE SERVICES
// ============================================================================
export default function ServicesPage() {
  const { t } = useLanguage();

  // ---------------------------------------------------------------------------
  //  LES 5 PÔLES — Chaque pôle pointe vers sa page dédiée
  // ---------------------------------------------------------------------------
  const services = [
    {
      id: 'electrical',
      title: 'Électricité & Solaire',
      label: 'ENERGY',
      description:
        'Électricité bâtiment, rénovation, maintenance, énergie solaire, onduleurs et batteries pour améliorer l\'autonomie de vos espaces.',
      icon: FaBolt,
      iconColor: 'text-amber-500',
      gradient: 'from-amber-500 to-orange-500',
      link: '/solutions/electrical',       // ✅ Page dédiée
      items: ['Installation électrique', 'Énergie solaire', 'Onduleurs', 'Batteries'],
    },
    {
      id: 'connectivity',
      title: 'Réseaux & Informatique',
      label: 'CONNECTIVITY',
      description:
        'Câblage structuré, Wi-Fi professionnel, baies de brassage, téléphonie IP et infrastructure IT pour PME et entreprises.',
      icon: FaNetworkWired,
      iconColor: 'text-blue-500',
      gradient: 'from-blue-500 to-indigo-500',
      link: '/solutions/connectivity',     // ✅ Page dédiée
      items: ['Câblage RJ45', 'Wi-Fi pro', 'Baies de brassage', 'Téléphonie IP'],
    },
    {
      id: 'smart',
      title: 'Domotique & Smart Building',
      label: 'SMART BUILDING',
      description:
        'Domotique, éclairage intelligent, scénarios automatiques, contrôle à distance et intégration multi-protocoles.',
      icon: FaHome,
      iconColor: 'text-cyan-500',
      gradient: 'from-cyan-500 to-teal-500',
      link: '/solutions/smart',            // ✅ Page dédiée
      items: ['Éclairage connecté', 'Scénarios', 'Thermostats', 'Contrôle mobile'],
    },
    {
      id: 'security',
      title: 'Sécurité électronique',
      label: 'SECURITY',
      description:
        'Vidéosurveillance, alarmes, contrôle d\'accès, clôtures électriques et supervision intelligente des bâtiments.',
      icon: FaShieldAlt,
      iconColor: 'text-red-500',
      gradient: 'from-red-500 to-rose-500',
      link: '/solutions/security',         // ✅ Page dédiée
      items: ['Vidéosurveillance', 'Alarmes', 'Contrôle d\'accès', 'Clôtures'],
    },
    {
      id: 'automation',
      title: 'Automatisation',
      label: 'AUTOMATION',
      description:
        'Motorisation de portails, portes automatiques, barrières, automatisation industrielle et contrôle à distance.',
      icon: FaDoorOpen,
      iconColor: 'text-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      link: '/solutions/automation',       // ✅ Page dédiée
      items: ['Portails', 'Portes garage', 'Barrières', 'Contrôle distante'],
    },
  ];

  // ---------------------------------------------------------------------------
  //  AVANTAGES CHEFFBUILD
  // ---------------------------------------------------------------------------
  const advantages = [
    { icon: FaCheckCircle, title: 'Matériel de qualité', desc: 'Marques professionnelles sélectionnées pour leur fiabilité.' },
    { icon: FaTools, title: 'Installation professionnelle', desc: 'Conception, pose et mise en service par nos techniciens certifiés.' },
    { icon: FaShieldAlt, title: 'Sécurité garantie', desc: 'Installations conformes aux normes en vigueur.' },
    { icon: FaCog, title: 'Maintenance & suivi', desc: 'Garantie 12 mois et contrats d\'entretien disponibles.' },
  ];

  return (
    <div className="bg-white">

      {/* ==================================================================
          HERO
      ================================================================== */}
      <section className="relative bg-[#050B16] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/smart-building.jpg"
            alt="CHEFFBUILD services"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16] via-[#050B16]/85 to-[#050B16]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_45%)] opacity-20" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 py-20 md:py-28 max-w-3xl">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            NOS SERVICES
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            One company.
            <br />
            <span className="text-[#00C2FF]">Complete solutions.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Cinq pôles techniques, une seule équipe pour concevoir, installer et
            maintenir l&apos;ensemble de vos infrastructures.
          </p>

          <p className="text-base text-gray-400 mb-8">
            Vous recherchez un partenaire de confiance pour vos équipements électriques,
            solaires, réseau et de sécurité électronique ?
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/devis"
              className="bg-[#00C2FF] hover:bg-[#00a8dd] text-[#050B16] font-bold py-4 px-8 rounded-lg transition flex items-center gap-2"
            >
              <FaFileAlt size={14} /> Demander un devis
            </Link>
            <a
              href="https://wa.me/237697654023"
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition flex items-center gap-2"
            >
              <FaWhatsapp size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================
          LES 5 PÔLES — Cartes cliquables vers les pages dédiées
      ================================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Nos domaines d&apos;expertise
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#050B16] mb-4">
              Un intégrateur, cinq pôles complémentaires
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              De l&apos;équipement à la maintenance, CHEFFBUILD accompagne chaque étape
              de vos projets techniques.
            </p>
          </div>

          {/* Grille : 1 / 2 / 3 colonnes selon écran */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  href={service.link}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* En-tête coloré */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-6 text-white relative`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {service.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight">
                      {service.title}
                    </h3>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Points forts */}
                    <ul className="space-y-2 mb-5">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className={`w-1.5 h-1.5 rounded-full ${service.iconColor.replace('text-', 'bg-')}`} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Lien "En savoir plus" */}
                    <span className={`inline-flex items-center gap-2 ${service.iconColor} font-bold text-sm group-hover:gap-3 transition-all`}>
                      En savoir plus <FaArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================
          AVANTAGES CHEFFBUILD
      ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#0066FF] font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Pourquoi CHEFFBUILD ?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#050B16]">
              Nos engagements
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[#00C2FF] hover:shadow-lg transition"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-[#050B16] mb-2">{adv.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION : POURQUOI NOUS CHOISIR
      ================================================================== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-[#050B16] mb-6 text-center">
              Qui sommes-nous ?
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6 text-center">
              <strong>CHEFFBUILD Smart Systems</strong> est une entreprise spécialisée dans
              l&apos;intégration de solutions techniques pour les PME et les résidences.
              Nous concevons, installons et maintenons des infrastructures permettant
              de rendre les bâtiments plus sûrs, plus connectés, plus autonomes et plus
              intelligents.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-center pt-6 border-t border-gray-100">
              <div>
                <div className="text-3xl mb-2">✔️</div>
                <p className="font-semibold text-[#050B16]">Matériel de qualité</p>
                <p className="text-gray-600 text-xs">Adapté à vos besoins</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔧</div>
                <p className="font-semibold text-[#050B16]">Installation pro</p>
                <p className="text-gray-600 text-xs">Rapide et fiable</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔒</div>
                <p className="font-semibold text-[#050B16]">Sécurité garantie</p>
                <p className="text-gray-600 text-xs">Caméras, alarmes, accès</p>
              </div>
            </div>

            <p className="text-center text-gray-700 mt-8 text-sm">
              Que vous soyez un particulier, une entreprise ou un professionnel, nous vous
              accompagnons avec des solutions fiables, modernes et durables.
              <br />
              <strong className="text-[#050B16]">
                Notre priorité : votre satisfaction, votre sécurité et le bon
                fonctionnement de vos installations.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================
          CTA FINAL
      ================================================================== */}
      <section className="py-20 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un projet technique ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contactez-nous pour un devis gratuit et personnalisé sous 24h.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/devis"
              className="bg-white text-[#0066FF] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
            >
              <FaFileAlt size={14} /> Demander un devis
            </Link>
            <Link
              href="/configurateur"
              className="bg-[#050B16] text-white font-bold py-4 px-8 rounded-lg hover:bg-black transition flex items-center gap-2"
            >
              🎯 Configurer mon projet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}