'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export default function ServicesPage() {
  const { t } = useLanguage();
  const services = [
    {
      title: t('electrical'),
      description: "Électricité bâtiment, rénovation, maintenance et énergie solaire pour améliorer l’autonomie de vos espaces.",
      icon: "⚡",
      link: "/installation",
      color: "bg-blue-500",
    },
    {
      title: t('security'),
      description: "Vidéosurveillance, alarmes, contrôle d’accès, clôture électrique et supervision intelligente des bâtiments.",
      icon: "🛡",
      link: "/maintenance",
      color: "bg-green-500",
    },
    {
      title: t('smart'),
      description: "Domotique, automatisation des portails, éclairage connecté et solutions Smart Building pilotables à distance.",
      icon: "🏠",
      link: "/installation",
      color: "bg-orange-500",
    },
    {
      title: t('storePole'),
      description: "Vente en ligne d’équipements électriques, réseau, CCTV, solaire, domotique et sécurité électronique.",
      icon: "🛒",
      link: "/boutique",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section intro */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('fourPoles')}</h1>
        <p className="text-lg text-gray-600">
          Vous recherchez un partenaire de confiance pour vos équipements électriques, solaires, réseau et de sécurité électronique ?
          {t('expertiseText')}
        </p>
      </div>

      {/* Grille de services */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.link}
            className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${service.color} p-6 text-center`}>
              <div className="text-5xl mb-3">{service.icon}</div>
              <h2 className="text-xl font-bold text-white">{service.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm">{service.description}</p>
              <span className="inline-block mt-4 text-blue-600 font-medium group-hover:underline">
                En savoir plus →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Avantages */}
      <div className="mt-16 bg-gray-100 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">{t('whoWeAre')} WISEBUILD</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">✔️</div>
            <p className="font-semibold">Matériel de qualité</p>
            <p className="text-gray-600 text-sm">Adapté à vos besoins</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔧</div>
            <p className="font-semibold">Installation professionnelle</p>
            <p className="text-gray-600 text-sm">Rapide et fiable</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-semibold">Systèmes de sécurité</p>
            <p className="text-gray-600 text-sm">Caméras, alarmes, contrôle d’accès</p>
          </div>
        </div>
        <p className="text-center text-gray-700 mt-8">
          Que vous soyez un particulier, une entreprise ou un professionnel, nous vous accompagnons avec des solutions fiables, modernes et durables.
          <br />
          <strong>Notre priorité : votre satisfaction, votre sécurité et le bon fonctionnement de vos installations.</strong>
        </p>
      </div>

      {/* Call to action */}
      <div className="mt-12 text-center">
        <Link
          href="/devis"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Contactez-nous dès aujourd’hui
        </Link>
      </div>
    </div>
  );
}