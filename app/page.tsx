import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Techkmer
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Services techniques – Achat d’outils, installation, contact technicien, devis
          </p>
          <Link
            href="/devis"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Demander un devis
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold mb-2">Achat d’outils</h3>
            <p className="text-gray-600">Large gamme d’outils professionnels de qualité.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Installation</h3>
            <p className="text-gray-600">Service d’installation par nos techniciens experts.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">👨‍🔧</div>
            <h3 className="text-xl font-semibold mb-2">Recherche technicien</h3>
            <p className="text-gray-600">Mise en relation avec un professionnel qualifié.</p>
          </div>
        </div>
      </section>

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