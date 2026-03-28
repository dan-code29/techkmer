import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/components/Carousel';

export default function MaintenancePage() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+33712345678';
  const whatsappLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
  const telegramLink = 'https://t.me/techkmer';

  // Services de maintenance existants
  const services = [
    {
      title: "Dépannage électrique",
      description: "Intervention rapide pour pannes électriques, court-circuits, tableaux, etc.",
      icon: "⚡",
    },
    {
      title: "Maintenance domotique",
      description: "Entretien et mise à jour de vos systèmes domotiques (KNX, Zigbee, etc.).",
      icon: "🏠",
    },
    {
      title: "Support informatique",
      description: "Assistance à distance ou sur site pour réseaux, sauvegardes, matériel.",
      icon: "💻",
    },
    {
      title: "Sécurité électronique",
      description: "Entretien des alarmes, caméras, contrôle d'accès.",
      icon: "🔒",
    },
  ];

  // Exemples d'interventions (remplacez par vos propres images/vidéos)
  const interventions = [
    { type: 'image', src: '/interventions/depannage1.jpg', title: 'Dépannage électrique - Panne générale' },
    { type: 'image', src: '/interventions/maintenance2.jpg', title: 'Maintenance domotique - Mise à jour' },
    { type: 'video', src: '/interventions/video-intervention.mp4', title: 'Intervention en cours' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Maintenance & Dépannage</h1>
      <p className="text-center text-gray-600 mb-6">
        Nous intervenons pour les particuliers et les entreprises afin d'assurer le bon fonctionnement de vos installations.
      </p>

      {/* Boutons de contact direct */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <a
          href={`tel:${phone}`}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-center hover:bg-green-700 transition"
        >
          📞 Appeler
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-center hover:bg-green-600 transition"
        >
          💬 WhatsApp
        </a>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-600 transition"
        >
          ✈️ Telegram
        </a>
      </div>

      {/* Services de maintenance */}
      <h2 className="text-2xl font-bold text-center mb-8">Nos services de maintenance</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((s) => (
          <div key={s.title} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Section Nos interventions */}
      <section className="bg-gray-100 py-12 px-4 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Nos interventions en cours & réalisées</h2>
        <Carousel items={interventions} autoplay delay={4000} />
      </section>

      {/* Lien vers devis */}
      <div className="mt-12 text-center">
        <Link href="/devis" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Demander un devis
        </Link>
      </div>
    </div>
  );
}