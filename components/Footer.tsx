import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne 1 : description de l'entreprise */}
        <div>
          <h3 className="text-xl font-bold mb-2">Tech Innov'Solutions</h3>
          <p className="text-gray-300 mb-2">
            <strong>Connecter • Éclairer • Protéger</strong>
          </p>
          <p className="text-gray-300 text-sm">
            Solutions techniques complètes : électricité, informatique, domotique et sécurité électronique. Installation, maintenance et conseils par des experts qualifiés.
          </p>
        </div>

        {/* Colonne 2 : liens rapides */}
        <div>
          <h4 className="font-semibold mb-2">Liens rapides</h4>
          <ul className="space-y-1">
            <li><Link href="/services" className="text-gray-300 hover:text-white transition">Services</Link></li>
            <li><Link href="/maintenance" className="text-gray-300 hover:text-white transition">Maintenance</Link></li>
            <li><Link href="/boutique" className="text-gray-300 hover:text-white transition">Boutique</Link></li>
            <li><Link href="/devis" className="text-gray-300 hover:text-white transition">Devis</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-white transition">À propos</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : coordonnées */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-gray-300">dancheffo29@gmail.com</p>
          <p className="text-gray-300">Tél : 697654023</p>
          <p className="text-gray-300"><Link href="/telegram" className="text-gray-300 hover:text-white transition">Telegram</Link></p>
          <p className="text-gray-300"></p>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Smart Redos Tech. Tous droits réservés. | Demain s'installe chez vous aujourd'hui
      </div>
    </footer>
  );
}