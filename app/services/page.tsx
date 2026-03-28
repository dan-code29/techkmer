import Link from 'next/link';
import Image from 'next/image';

export default function ServicesPage() {
  const services = [
    {
      title: "Vente d'équipements",
      description: "Matériel informatique, sécurité électronique, électricité, domotique. Marques de qualité.",
      icon: "🛒",
      link: "/boutique",
      color: "bg-blue-500",
    },
    {
      title: "Installation & mise en service",
      description: "Installation professionnelle de vos équipements par nos techniciens experts.",
      icon: "🔧",
      link: "/installation",
      color: "bg-green-500",
    },
    {
      title: "Maintenance & dépannage",
      description: "Entretien, réparation et dépannage pour particuliers et entreprises.",
      icon: "🛠️",
      link: "/maintenance",
      color: "bg-orange-500",
    },
    {
      title: "Devis personnalisés",
      description: "Demandez un devis gratuit pour vos projets sur mesure.",
      icon: "📄",
      link: "/devis",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section intro */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos services</h1>
        <p className="text-lg text-gray-600">
          Vous recherchez un partenaire de confiance pour vos équipements électriques, informatiques et de sécurité électronique ?
          Nous vous proposons des solutions complètes allant de la vente à l’installation, jusqu’à la maintenance.
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
        <h2 className="text-2xl font-bold text-center mb-6">Pourquoi choisir Techkmer ?</h2>
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