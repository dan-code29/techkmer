import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/components/Carousel'; // Assurez-vous que le composant existe

export default function InstallationPage() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+237 697654023';
  const whatsappLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
  const telegramLink = 'https://t.me/Dan_Cheff'; // à adapter

  // Liste des services d'installation
  const services = [
    {
      title: 'Installation électrique',
      description: 'Mise aux normes, création de circuits, tableau électrique.',
      icon: '⚡',
    },
    {
      title: 'Installation domotique',
      description: 'Systèmes connectés, gestion centralisée, éclairage intelligent.',
      icon: '🏠',
    },
    {
      title: 'Sécurité électronique',
      description: 'Alarmes, caméras, contrôle d’accès, interphonie.',
      icon: '🔒',
    },
    {
      title: 'Informatique & réseaux',
      description: 'Câblage, serveurs, Wi-Fi, sauvegarde.',
      icon: '💻',
    },
  ];

  // Exemples de réalisations (remplacez par vos propres images/vidéos)
  const realisations = [
    { type: 'image', src: '/realisations/installation1.jpg', title: 'Installation domotique - Maison connectée' },
    { type: 'image', src: '/realisations/installation2.jpg', title: 'Mise en place d’un tableau électrique' },
    { type: 'video', src: '/realisations/video-installation.mp4', title: 'Démonstration installation sécurité' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Installation sur mesure</h1>
      <p className="text-center text-gray-600 mb-6">
        Nous installons tous vos équipements (électricité, domotique, sécurité, informatique).
        Contactez-nous directement ou demandez un devis.
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

      {/* Services d'installation */}
      <h2 className="text-2xl font-bold text-center mb-8">Nos prestations d'installation</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((s) => (
          <div key={s.title} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Section Nos réalisations */}
      <section className="bg-gray-100 py-12 px-4 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Nos réalisations</h2>
        <Carousel items={realisations} autoplay delay={4000} />
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