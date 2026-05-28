import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/components/Carousel';
import LatestProducts from '@/components/LatestProducts';
import PromotionCarousel from '@/components/PromotionCarousel'; // <-- import

export default function Home() {
  const realisations: { type: 'image' | 'video'; src: string; title: string }[] = [
    { type: 'image', src: '/realisations/projet1.jpg', title: 'Rénovation électrique - Paris' },
    { type: 'image', src: '/realisations/projet2.jpg', title: 'Installation domotique - Lyon' },
    { type: 'video', src: '/realisations/video-demo.mp4', title: 'Démonstration installation' },
  ];

  const heroSlides = [
    { type: 'image', src: '/images/background tech.png', title: 'Installation électrique de qualité' },
    { type: 'image', src: '/images/background3.png', title: 'Solutions domotiques professionnelles' },
    { type: 'image', src: '/images/background2.png', title: 'Maintenance rapide et fiable' },
  ];

  return (
    <div className="bg-gray-50">
      {/* Bannière promotionnelle */}
      <div className="bg-yellow-500 text-gray-900 py-3 text-center font-semibold">
        <div className="container mx-auto px-4">
          🚨 PROMO D'ÉTÉ : -20% sur tous les outils jusqu'au 30 avril ! 
          <Link href="/boutique" className="underline ml-2 hover:text-blue-800">
            Profitez-en
          </Link>
        </div>
      </div>

      {/* Section Héros */}
      <div className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 z-0">
          <Carousel items={heroSlides} autoplay delay={8500} showNavigation={false} showPagination={false} />
        </div>
        <div className="relative z-10 container mx-auto px-16 py-26 text-right">
          <p className="text-lg md:text-xl mb-4 font-semibold max-w-3xl mx-auto">
            <span className="block">Une énergie sous contrôle,</span>
            <span className="block mt-2 text-base md:text-lg">une maison qui vous obéit.</span>
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium">
            Simple. Sûr. Connecté
          </p>
          <Link
            href="/devis"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Demander un devis
          </Link>
        </div>
      </div>

      {/* Carrousel des produits en promotion */}
      <PromotionCarousel />

      {/* Section Services */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Vente d'équipements",
              desc: "Matériel informatique, sécurité électronique, électricité, domotique. Marques de qualité.",
              img: "/images/services/vente.png",
              alt: "Vente d'équipements",
              link: "/boutique"
            },
            {
              title: "Installation & mise en service",
              desc: "Installation de vos équipements par nos techniciens experts.",
              img: "/images/services/installationss.png",
              alt: "Installation",
              link: "/installation"
            },
            {
              title: "Maintenance & dépannage",
              desc: "Intervention rapide pour particuliers et entreprises. Dépannage électrique, domotique, informatique.",
              img: "/images/services/maintenance.png",
              alt: "Maintenance",
              link: "/maintenance"
            }
          ].map((service) => (
            <Link
              key={service.title}
              href={service.link}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1 block"
            >
              <div className="relative h-48">
                <Image src={service.img} alt={service.alt} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Qui sommes-nous */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Qui sommes-nous ?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Techkmer est une entreprise spécialisée dans la vente de matériel informatique,
            sécurité électronique, électricité et domotique. Nous accompagnons particuliers
            et entreprises de l’installation à la maintenance, avec une équipe de techniciens
            expérimentés et une volonté de vous offrir un service de qualité.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 text-blue-600 hover:underline font-medium"
          >
            En savoir plus →
          </Link>
        </div>
      </section>

      {/* Section Nos réalisations */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nos réalisations</h2>
          <Carousel items={realisations} autoplay delay={4000} />
        </div>
      </section>

      {/* Section Derniers articles */}
      <LatestProducts />

      {/* Call to action */}
      <section className="bg-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Vous avez un projet ?</h2>
          <p className="mb-6">Contactez-nous pour un devis personnalisé.</p>
          <Link
            href="/devis"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Obtenir un devis
          </Link>
        </div>
      </section>
    </div>
  );
}