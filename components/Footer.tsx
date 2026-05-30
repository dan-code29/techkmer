import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#050B16] text-white mt-20 border-t border-cyan-500/20 overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#00BFFF,transparent_35%)]"></div>
      <div className="absolute inset-0 opacity-5 bg-[url('/images/circuit-pattern.png')] bg-cover bg-center"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Colonne 1 */}
          <div>
            <h3 className="text-3xl font-bold tracking-wide mb-4">
              <span className="text-white">Tech Innov'</span>
              <span className="text-cyan-400">Solutions</span>
            </h3>
            <p className="text-cyan-400 font-semibold tracking-wider mb-4">
              Connecter • Éclairer • Protéger
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">
              Solutions techniques complètes : électricité, informatique, domotique et sécurité électronique.
              Installation, maintenance et conseils par des experts qualifiés.
            </p>
            {/* Icônes services (emojis) */}
            <div className="grid grid-cols-3 gap-4 mt-8 text-center text-xs">
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 text-2xl">🌐</span>
                <span>Réseau</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-yellow-400 text-2xl">⚡</span>
                <span>Électricité</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 text-2xl">🏠</span>
                <span>Domotique</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 text-2xl">🛡️</span>
                <span>Sécurité</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 text-2xl">📹</span>
                <span>Contrôle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 text-2xl">🔧</span>
                <span>Maintenance</span>
              </div>
            </div>
          </div>

          {/* Colonne 2 */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-cyan-400">Liens rapides</h4>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-gray-300 hover:text-cyan-400 transition">Services</Link></li>
              <li><Link href="/maintenance" className="text-gray-300 hover:text-cyan-400 transition">Maintenance</Link></li>
              <li><Link href="/boutique" className="text-gray-300 hover:text-cyan-400 transition">Boutique</Link></li>
              <li><Link href="/devis" className="text-gray-300 hover:text-cyan-400 transition">Devis</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-cyan-400 transition">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-cyan-400">Nos Expertises</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li>⚡ Électricité générale</li>
              <li>🌐 Réseaux informatiques</li>
              <li>🏠 Domotique & Smart Home</li>
              <li>🛡️ Sécurité électronique</li>
              <li>📹 Vidéosurveillance</li>
              <li>🚪 Motorisation de portail</li>
              <li>🔐 Contrôle d’accès</li>
            </ul>
          </div>

          {/* Colonne 4 */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-cyan-400">Contact</h4>
            <div className="space-y-5 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">📧</span>
                <a href="mailto:dancheffo29@gmail.com" className="hover:text-cyan-400 transition">dancheffo29@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">📞</span>
                <a href="tel:+237697654023" className="hover:text-cyan-400 transition">697654023</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">✈️</span>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Telegram</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">💬</span>
                <a href="https://wa.me/237697654023" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">WhatsApp</a>
              </div>
            </div>
            <div className="mt-8 p-5 rounded-2xl border border-cyan-500/20 bg-white/5 backdrop-blur-sm">
              <h5 className="font-semibold text-cyan-400 mb-2">Besoin d’un accompagnement ?</h5>
              <p className="text-gray-300 text-sm leading-relaxed">
                Notre équipe est à votre écoute pour tous vos projets résidentiels et professionnels.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Tech Innov'Solutions. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cyan-400 transition">Politique de confidentialité</Link>
            <Link href="/mentions" className="hover:text-cyan-400 transition">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}