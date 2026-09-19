'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import {
  generateEquipmentList,
  computeTotals,
  ProjectType,
  EquipLevel,
  ConfiguratorInput,
  GeneratedItem,
} from '@/lib/configurator-rules';
import {
  FaHome, FaBuilding, FaStore, FaWarehouse, FaIndustry,
  FaCheckCircle, FaArrowRight, FaArrowLeft, FaBolt, FaSun,
  FaNetworkWired, FaShieldAlt, FaCog, FaDoorOpen, FaFileAlt,
  FaShoppingCart, FaWhatsapp, FaRuler, FaDoorClosed, FaRedo,
} from 'react-icons/fa';

// ============================================================================
//  TYPES DE PROJET
// ============================================================================
const PROJECT_TYPES: { id: ProjectType; label: string; icon: any; desc: string }[] = [
  { id: 'maison', label: 'Maison', icon: FaHome, desc: 'Villa, pavillon, duplex' },
  { id: 'appartement', label: 'Appartement', icon: FaBuilding, desc: 'Studio, F2, F3, F4' },
  { id: 'bureau', label: 'Bureau', icon: FaIndustry, desc: 'Open space, plateau' },
  { id: 'commerce', label: 'Commerce', icon: FaStore, desc: 'Boutique, restaurant' },
  { id: 'entrepot', label: 'Entrepôt', icon: FaWarehouse, desc: 'Entrepôt, atelier' },
];

// ============================================================================
//  NIVEAUX D'ÉQUIPEMENT
// ============================================================================
const EQUIP_LEVELS: { id: EquipLevel; label: string; desc: string }[] = [
  { id: 'none', label: 'Aucun', desc: 'Non concerné' },
  { id: 'basic', label: 'Basique', desc: 'L\'essentiel' },
  { id: 'standard', label: 'Standard', desc: 'Confort' },
  { id: 'premium', label: 'Premium', desc: 'Tout inclus' },
];

// ============================================================================
//  COMPOSANT PRINCIPAL
// ============================================================================
export default function ConfigurateurPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showResults, setShowResults] = useState(false);

  // ---------------------------------------------------------------------------
  //  ÉTATS DU FORMULAIRE
  // ---------------------------------------------------------------------------
  const [input, setInput] = useState<ConfiguratorInput>({
    projectType: 'maison',
    surface: 100,
    rooms: 4,
    electrical: 'standard',
    solar: 'none',
    network: 'standard',
    security: 'basic',
    smart: 'none',
    automation: 'none',
  });

  // ---------------------------------------------------------------------------
  //  GÉNÉRATION DES RÉSULTATS
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    if (!showResults) return null;
    const items = generateEquipmentList(input);
    const totals = computeTotals(items);
    return { items, totals };
  }, [input, showResults]);

  // ---------------------------------------------------------------------------
  //  HANDLERS
  // ---------------------------------------------------------------------------
  const updateInput = <K extends keyof ConfiguratorInput>(key: K, value: ConfiguratorInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    setShowResults(true);
    // Scroll vers les résultats
    setTimeout(() => {
      document.getElementById('configurator-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleReset = () => {
    setShowResults(false);
    setStep(1);
    setInput({
      projectType: 'maison',
      surface: 100,
      rooms: 4,
      electrical: 'standard',
      solar: 'none',
      network: 'standard',
      security: 'basic',
      smart: 'none',
      automation: 'none',
    });
  };

  const handleRequestQuote = () => {
    if (!results) return;
    // On passe les détails au formulaire de devis via sessionStorage
    sessionStorage.setItem(
      'configurator-quote',
      JSON.stringify({
        input,
        items: results.items,
        totals: results.totals,
      })
    );
    router.push('/devis?from=configurateur');
  };

  // ---------------------------------------------------------------------------
  //  RENDU
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ==================================================================
            HERO
        ================================================================== */}
        <div className="text-center mb-10">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            🎯 Configurateur de projet
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050B16] mb-4">
            Décrivez votre projet,
            <br />
            <span className="text-emerald-600">recevez vos équipements</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En 2 minutes, obtenez une liste d'équipements adaptée à votre bâtiment
            avec une estimation budgétaire précise.
          </p>
        </div>

        {/* ==================================================================
            FORMULAIRE (visible tant qu'on n'a pas généré)
        ================================================================== */}
        {!showResults && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Barre de progression */}
            <div className="bg-gradient-to-r from-[#050B16] to-[#0a1a3a] px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#00C2FF] uppercase tracking-widest">
                  Étape {step} sur 3
                </span>
                <span className="text-xs text-gray-400">
                  {step === 1 && 'Votre projet'}
                  {step === 2 && 'Vos besoins techniques'}
                  {step === 3 && 'Niveau de gamme'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1.5 rounded-full transition ${
                      s <= step ? 'bg-[#00C2FF]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">

              {/* ============ ÉTAPE 1 : TYPE DE PROJET ============ */}
              {step === 1 && (
                <div className="space-y-8">
                  {/* Type de projet */}
                  <div>
                    <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                      Type de bâtiment
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {PROJECT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const active = input.projectType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => updateInput('projectType', type.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                              active
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                            }`}
                          >
                            <Icon size={24} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                            <span className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                              {type.label}
                            </span>
                            <span className="text-[10px] text-gray-500 text-center leading-tight">
                              {type.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Surface + pièces */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        <FaRuler className="inline mr-2" size={12} /> Surface (m²)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={20}
                          max={1000}
                          step={10}
                          value={input.surface}
                          onChange={(e) => updateInput('surface', Number(e.target.value))}
                          className="flex-1 accent-emerald-600"
                        />
                        <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-[100px] text-center">
                          <span className="font-bold text-[#050B16] text-lg">{input.surface}</span>
                          <span className="text-xs text-gray-500 ml-1">m²</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        <FaDoorClosed className="inline mr-2" size={12} /> Nombre de pièces
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={1}
                          value={input.rooms}
                          onChange={(e) => updateInput('rooms', Number(e.target.value))}
                          className="flex-1 accent-emerald-600"
                        />
                        <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-[100px] text-center">
                          <span className="font-bold text-[#050B16] text-lg">{input.rooms}</span>
                          <span className="text-xs text-gray-500 ml-1">pièces</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ ÉTAPE 2 : BESOINS TECHNIQUES ============ */}
              {step === 2 && (
                <div className="space-y-6">
                  {[
                    { key: 'electrical' as const, icon: FaBolt, label: 'Électricité', desc: 'Prises, éclairage, tableau' },
                    { key: 'solar' as const, icon: FaSun, label: 'Énergie solaire', desc: 'Panneaux, batteries, onduleurs' },
                    { key: 'network' as const, icon: FaNetworkWired, label: 'Réseau & Wi-Fi', desc: 'Câblage, baie, points d\'accès' },
                    { key: 'security' as const, icon: FaShieldAlt, label: 'Sécurité', desc: 'Caméras, alarme, contrôle d\'accès' },
                    { key: 'smart' as const, icon: FaCog, label: 'Domotique', desc: 'Éclairage intelligent, scénarios' },
                    { key: 'automation' as const, icon: FaDoorOpen, label: 'Automatisation', desc: 'Portail, portes motorisées' },
                  ].map((need) => {
                    const Icon = need.icon;
                    return (
                      <div key={need.key} className="flex flex-wrap items-center gap-4 p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-[#050B16] text-sm">{need.label}</p>
                            <p className="text-xs text-gray-500">{need.desc}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-auto">
                          {EQUIP_LEVELS.map((lvl) => {
                            const active = input[need.key] === lvl.id;
                            return (
                              <button
                                key={lvl.id}
                                type="button"
                                onClick={() => updateInput(need.key, lvl.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition border-2 ${
                                  active
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                                }`}
                              >
                                {lvl.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ============ ÉTAPE 3 : RÉCAPITULATIF ============ */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                      <FaCheckCircle /> Récapitulatif de votre projet
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Type :</span>{' '}
                          {PROJECT_TYPES.find((p) => p.id === input.projectType)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Surface :</span> {input.surface} m²
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Pièces :</span> {input.rooms}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Électricité :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.electrical)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Solaire :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.solar)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Réseau :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.network)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Sécurité :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.security)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Domotique :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.smart)?.label}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Automatisation :</span>{' '}
                          {EQUIP_LEVELS.find((l) => l.id === input.automation)?.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 text-lg"
                  >
                    🚀 Générer ma liste d'équipements
                  </button>
                </div>
              )}

              {/* ============ NAVIGATION ============ */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
                    disabled={step === 1}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <FaArrowLeft size={12} /> Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(3, s + 1) as any)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition"
                  >
                    Suivant <FaArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            RÉSULTATS
        ================================================================== */}
        {showResults && results && (
          <div id="configurator-results" className="space-y-6">

            {/* En-tête résultats */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Votre projet personnalisé
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#050B16] mt-1">
                    Liste d'équipements suggérée
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {results.items.length} types d'équipements · {results.totals.count} unités au total
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition border border-gray-200 hover:border-emerald-300 px-4 py-2 rounded-lg"
                >
                  <FaRedo size={11} /> Reconfigurer
                </button>
              </div>

              {/* Carte budget */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-xl p-5 shadow-lg">
                  <p className="text-xs uppercase tracking-widest opacity-90 mb-1">
                    Budget estimé
                  </p>
                  <p className="text-3xl font-bold">
                    {formatPrice(results.totals.grandTotal)}
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    Équipements + main d'œuvre
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Équipements
                  </p>
                  <p className="text-2xl font-bold text-[#050B16]">
                    {formatPrice(results.totals.subtotal)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.items.length} références
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Main d'œuvre (15%)
                  </p>
                  <p className="text-2xl font-bold text-[#050B16]">
                    {formatPrice(results.totals.labor)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Installation incluse
                  </p>
                </div>
              </div>
            </div>

            {/* Liste des équipements */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-[#050B16]">
                  Détail des équipements suggérés
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {results.items.map((item, i) => (
                  <div key={i} className="p-4 md:p-5 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-[#050B16]">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        Catégorie : {item.category}
                        {item.note && ` · ${item.note}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Quantité</p>
                        <p className="font-bold text-[#050B16]">
                          × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-emerald-600">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                          item.priority === 'essentiel'
                            ? 'bg-red-50 text-red-600'
                            : item.priority === 'confort'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleRequestQuote}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                <FaFileAlt size={14} /> Demander un devis détaillé
              </button>
              <a
                href={`https://wa.me/237697654023?text=${encodeURIComponent(
                  `Bonjour, voici mon projet : ${input.projectType} de ${input.surface}m² avec ${input.rooms} pièces. Je souhaite un devis.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
              >
                <FaWhatsapp size={16} /> Envoyer par WhatsApp
              </a>
              <Link
                href="/boutique"
                className="bg-[#050B16] hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
              >
                <FaShoppingCart size={14} /> Explorer la boutique
              </Link>
            </div>

            {/* Note informative */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              💡 <strong>À savoir :</strong> cette liste est une estimation basée sur des ratios
              standards. Notre équipe peut l'ajuster selon vos besoins spécifiques lors du devis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}