import Link from 'next/link';
import { 
  FaWhatsapp, 
  FaTelegramPlane, 
  FaNetworkWired, 
  FaShieldAlt, 
  FaWrench,
  FaHome,
  FaVideo
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdPhone, 
  MdElectricBolt, 
  MdSecurity,
  MdBuild
} from 'react-icons/md';
import { FiZap } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative text-white mt-20 border-t border-cyan-500/20 overflow-hidden bg-[url('/images/backgroundfooter.png')] bg-cover bg-center">
      {/* Effets de fond */}
      <div className="absolute inset-0 opacity-30 bg-[#072660]"></div>
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
            {/* Services Icons avec react-icons */}
            <div className="grid grid-cols-3 gap-4 mt-8 text-center text-xs">
              <div className="flex flex-col items-center gap-2">
                <FaNetworkWired className="text-cyan-400" size={26} />
                <span>Réseau</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MdElectricBolt className="text-yellow-400" size={26} />
                <span>Électricité</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FaHome className="text-cyan-400" size={26} />
                <span>Domotique</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FaShieldAlt className="text-cyan-400" size={26} />
                <span>Sécurité</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FaVideo className="text-cyan-400" size={26} />
                <span>Contrôle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FaWrench className="text-cyan-400" size={26} />
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
              <li><FiZap className="inline mr-2" /> Électricité générale</li>
              <li><FaNetworkWired className="inline mr-2" /> Réseaux informatiques</li>
              <li><FaHome className="inline mr-2" /> Domotique & Smart Home</li>
              <li><MdSecurity className="inline mr-2" /> Sécurité électronique</li>
              <li><FaVideo className="inline mr-2" /> Vidéosurveillance</li>
              <li>🚪 Motorisation de portail</li>
              <li>🔐 Contrôle d’accès</li>
            </ul>
          </div>

          {/* Colonne 4 */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-cyan-400">Contact</h4>
            <div className="space-y-5 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <MdEmail className="text-cyan-400" size={20} />
                <a href="mailto:dancheffo29@gmail.com" className="hover:text-cyan-400 transition">dancheffo29@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-cyan-400" size={20} />
                <a href="tel:+237697654023" className="hover:text-cyan-400 transition">697654023</a>
              </div>
              <div className="flex items-center gap-3">
                <FaTelegramPlane className="text-cyan-400" size={20} />
                <a href="https://t.me/Dan_Cheff" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Telegram</a>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-400" size={20} />
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