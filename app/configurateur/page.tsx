'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import {
  generateEquipmentList,
  computeTotals,
  getRequiredFields,
  COMPLEXITY_MULTIPLIERS,
  ProjectType,
  EquipLevel,
  SupportComplexity,
  Domain,
  ConfiguratorInput,
} from '@/lib/configurator-rules';
import {
  FaHome, FaBuilding, FaStore, FaWarehouse, FaIndustry,
  FaCheckCircle, FaArrowRight, FaArrowLeft, FaBolt, FaSun,
  FaNetworkWired, FaShieldAlt, FaCog, FaDoorOpen, FaFileAlt,
  FaShoppingCart, FaWhatsapp, FaRuler, FaDoorClosed, FaRedo,
  FaLayerGroup, FaHammer, FaFire, FaTools, FaLock,
} from 'react-icons/fa';

// ============================================================================
//  DOMAINES DE BESOINS
// ============================================================================
const DOMAINS: { id: Domain; icon: any; label: string; desc: string; color: string }[] = [
  { id: 'electrical', icon: FaBolt, label: 'Électricité', desc: 'Prises, éclairage, tableau', color: 'text-amber-500' },
  { id: 'solar', icon: FaSun, label: 'Énergie solaire', desc: 'Panneaux, batteries, onduleurs', color: 'text-yellow-500' },
  { id: 'network', icon: FaNetworkWired, label: 'Réseau & Wi-Fi', desc: 'Câblage, baie, points d\'accès', color: 'text-blue-500' },
  { id: 'security', icon: FaShieldAlt, label: 'Sécurité', desc: 'Caméras, alarme, accès', color: 'text-red-500' },
  { id: 'smart', icon: FaHome, label: 'Domotique', desc: 'Éclairage intelligent, scénarios', color: 'text-cyan-500' },
  { id: 'automation', icon: FaDoorOpen, label: 'Automatisation', desc: 'Portails, portes motorisées', color: 'text-purple-500' },
  { id: 'fence', icon: FaFire, label: 'Clôture électrique', desc: 'Périmètre, électrificateur', color: 'text-orange-500' },
  { id: 'maintenance', icon: FaTools, label: 'Maintenance / Rénovation', desc: 'Diagnostic, réparation', color: 'text-gray-500' },
];

const PROJECT_TYPES: { id: ProjectType; label: string; icon: any }[] = [
  { id: 'maison', label: 'Maison', icon: FaHome },
  { id: 'appartement', label: 'Appartement', icon: FaBuilding },
  { id: 'bureau', label: 'Bureau', icon: FaIndustry },
  { id: 'commerce', label: 'Commerce', icon: FaStore },
  { id: 'entrepot', label: 'Entrepôt', icon: FaWarehouse },
];

const EQUIP_LEVELS: { id: EquipLevel; label: string; desc: string }[] = [
  { id: 'basic', label: 'Basique', desc: 'L\'essentiel' },
  { id: 'standard', label: 'Standard', desc: 'Confort' },
  { id: 'premium', label: 'Premium', desc: 'Tout inclus' },
];

const TRADE_LABELS: Record<string, string> = {
  electricien: '⚡ Électricien',
  reseau: '🌐 Réseau',
  securite: '📹 Sécurité',
  domotique: '🏠 Domotique',
  solaire: '☀️ Solaire',
  automatisme: '🚪 Automatisme',
  maintenance: '🔧 Maintenance',
};

// ============================================================================
//  COMPOSANT PRINCIPAL
// ============================================================================
export default function ConfigurateurPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showResults, setShowResults] = useState(false);
  const [customFloorsEnabled, setCustomFloorsEnabled] = useState(false);

  const [input, setInput] = useState<ConfiguratorInput>({
    domains: [],
    projectType: 'maison',
    surface: 100,
    rooms: 4,
    floors: 1,
    customFloors: undefined,
    supportComplexity: 'neuf',
    perimeter: 50,
    gateCount: 1,
    gateType: 'sliding',
    levels: {},
  });

  // ---------------------------------------------------------------------------
  //  Champs nécessaires selon les domaines choisis
  // ---------------------------------------------------------------------------
  const requiredFields = useMemo(
    () => getRequiredFields(input.domains),
    [input.domains]
  );

  // Nombre total d'étapes visibles (toujours 4 ici, mais on peut adapter)
  const totalSteps = 4;

  // ---------------------------------------------------------------------------
  //  Résultats
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    if (!showResults) return null;
    const items = generateEquipmentList(input);
    const totals = computeTotals(items, input);
    return { items, totals };
  }, [input, showResults]);

  // ---------------------------------------------------------------------------
  //  Handlers
  // ---------------------------------------------------------------------------
  const updateInput = <K extends keyof ConfiguratorInput>(
    key: K,
    value: ConfiguratorInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDomain = (d: Domain) => {
    setInput((prev) => {
      const has = prev.domains.includes(d);
      const newDomains = has
        ? prev.domains.filter((x) => x !== d)
        : [...prev.domains, d];

      // Si on retire un domaine, on supprime aussi son niveau
      const newLevels = { ...prev.levels };
      if (has) delete newLevels[d];

      return { ...prev, domains: newDomains, levels: newLevels };
    });
  };

  const updateLevel = (d: Domain, level: EquipLevel) => {
    setInput((prev) => ({
      ...prev,
      levels: { ...prev.levels, [d]: level },
    }));
  };

  const handleGenerate = () => {
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('configurator-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleReset = () => {
    setShowResults(false);
    setStep(1);
    setCustomFloorsEnabled(false);
    setInput({
      domains: [],
      projectType: 'maison',
      surface: 100,
      rooms: 4,
      floors: 1,
      customFloors: undefined,
      supportComplexity: 'neuf',
      perimeter: 50,
      gateCount: 1,
      gateType: 'sliding',
      levels: {},
    });
  };

  const handleRequestQuote = () => {
    if (!results) return;
    sessionStorage.setItem(
      'configurator-quote',
      JSON.stringify({ input, items: results.items, totals: results.totals })
    );
    router.push('/devis?from=configurateur');
  };

  // Empêcher de passer à l'étape 2 si aucun domaine
  const canGoNext = () => {
    if (step === 1) return input.domains.length > 0;
    if (step === 3) {
      // Tous les domaines choisis doivent avoir un niveau
      return input.domains.every((d) => input.levels[d]);
    }
    return true;
  };

  // ============================================================================
  //  RENDU
  // ============================================================================
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* HERO */}
        <div className="text-center mb-10">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            🎯 Configurateur intelligent
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050B16] mb-4">
            Décrivez votre besoin,
            <br />
            <span className="text-emerald-600">recevez votre estimation</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sélectionnez vos domaines — nous ne vous demandons que les informations nécessaires.
          </p>
        </div>

        {!showResults && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Barre de progression */}
            <div className="bg-gradient-to-r from-[#050B16] to-[#0a1a3a] px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#00C2FF] uppercase tracking-widest">
                  Étape {step} sur {totalSteps}
                </span>
                <span className="text-xs text-gray-400">
                  {step === 1 && 'Vos besoins'}
                  {step === 2 && 'Votre projet'}
                  {step === 3 && 'Niveau de gamme'}
                  {step === 4 && 'Récapitulatif'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
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

              {/* ============ ÉTAPE 1 : BESOINS (domaines) ============ */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#050B16] mb-2">
                      De quoi avez-vous besoin ?
                    </h2>
                    <p className="text-sm text-gray-500">
                      Sélectionnez un ou plusieurs domaines. Nous adapterons les questions suivantes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DOMAINS.map((d) => {
                      const Icon = d.icon;
                      const active = input.domains.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDomain(d.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition relative ${
                            active
                              ? 'border-emerald-500 bg-emerald-50 shadow-md'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                          }`}
                        >
                          {active && (
                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                              <FaCheckCircle size={10} className="text-white" />
                            </span>
                          )}
                          <Icon size={24} className={active ? 'text-emerald-600' : d.color} />
                          <span className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                            {d.label}
                          </span>
                          <span className="text-[10px] text-gray-500 text-center leading-tight">
                            {d.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {input.domains.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
                      ✓ <strong>{input.domains.length}</strong> domaine{input.domains.length > 1 ? 's' : ''} sélectionné{input.domains.length > 1 ? 's' : ''}
                      {requiredFields.isSimpleProject && (
                        <span className="block mt-1 text-xs">
                          💡 Projet simple : nous n'aurons besoin que de quelques informations.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============ ÉTAPE 2 : BÂTIMENT (dynamique) ============ */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#050B16] mb-2">
                      Informations sur votre projet
                    </h2>
                    <p className="text-sm text-gray-500">
                      {requiredFields.isSimpleProject
                        ? 'Renseignez les quelques informations nécessaires.'
                        : 'Aidez-nous à dimensionner votre installation.'}
                    </p>
                  </div>

                  {/* Type de bâtiment (si concerné) */}
                  {requiredFields.needsBuilding && (
                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        Type de bâtiment
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PROJECT_TYPES.map((t) => {
                          const Icon = t.icon;
                          const active = input.projectType === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => updateInput('projectType', t.id)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                                active
                                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <Icon size={22} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                              <span className={`text-xs font-bold ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                                {t.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Surface (si concerné) */}
                  {requiredFields.needsSurface && (
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
                  )}

                  {/* Pièces (si concerné) */}
                  {requiredFields.needsRooms && (
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
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étages (si concerné) */}
                  {requiredFields.needsFloors && (
                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        <FaLayerGroup className="inline mr-2" size={12} /> Nombre d'étages
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => {
                              updateInput('floors', n);
                              setCustomFloorsEnabled(false);
                              updateInput('customFloors', undefined);
                            }}
                            className={`py-3 rounded-xl border-2 font-bold text-center transition ${
                              input.floors === n && !customFloorsEnabled
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCustomFloorsEnabled(true)}
                          className={`py-3 rounded-xl border-2 font-bold text-center transition text-xs ${
                            customFloorsEnabled
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                          }`}
                        >
                          Autre
                        </button>
                      </div>

                      {customFloorsEnabled && (
                        <div className="mt-3">
                          <input
                            type="number"
                            min={6}
                            max={50}
                            placeholder="Nombre d'étages"
                            value={input.customFloors || ''}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              updateInput('customFloors', v);
                              updateInput('floors', v);
                            }}
                            className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Complexité (si concerné) */}
                  {requiredFields.needsComplexity && (
                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        <FaHammer className="inline mr-2" size={12} /> Type de support
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(COMPLEXITY_MULTIPLIERS).map(([key, info]) => {
                          const active = input.supportComplexity === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => updateInput('supportComplexity', key as SupportComplexity)}
                              className={`p-4 rounded-xl border-2 text-left transition ${
                                active
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <p className={`font-bold text-sm mb-1 ${active ? 'text-emerald-700' : 'text-[#050B16]'}`}>
                                {info.label}
                              </p>
                              <p className="text-xs text-gray-500">Main d'œuvre : ×{info.labor}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Périmètre (clôture électrique) */}
                  {requiredFields.needsPerimeter && (
                    <div>
                      <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                        🔥 Périmètre à clôturer (mètres linéaires)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={10}
                          max={500}
                          step={10}
                          value={input.perimeter}
                          onChange={(e) => updateInput('perimeter', Number(e.target.value))}
                          className="flex-1 accent-emerald-600"
                        />
                        <div className="bg-gray-100 rounded-lg px-4 py-2 min-w-[100px] text-center">
                          <span className="font-bold text-[#050B16] text-lg">{input.perimeter}</span>
                          <span className="text-xs text-gray-500 ml-1">m</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Portails (automatisation) */}
                  {requiredFields.needsGate && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                          🚪 Nombre de portails / portes à motoriser
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => updateInput('gateCount', n)}
                              className={`py-3 rounded-xl border-2 font-bold transition ${
                                input.gateCount === n
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#050B16] mb-3 uppercase tracking-wide">
                          Type de portail
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'sliding', label: 'Coulissant' },
                            { id: 'swing', label: 'Battant' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => updateInput('gateType', t.id as any)}
                              className={`p-4 rounded-xl border-2 font-bold transition ${
                                input.gateType === t.id
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ============ ÉTAPE 3 : NIVEAUX PAR DOMAINE ============ */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#050B16] mb-2">
                      Niveau de gamme
                    </h2>
                    <p className="text-sm text-gray-500">
                      Choisissez le niveau souhaité pour chacun de vos besoins.
                    </p>
                  </div>

                  {input.domains.map((d) => {
                    const domainInfo = DOMAINS.find((x) => x.id === d);
                    if (!domainInfo) return null;
                    const Icon = domainInfo.icon;

                    return (
                      <div key={d} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Icon size={18} className={domainInfo.color} />
                          </div>
                          <div>
                            <p className="font-bold text-[#050B16]">{domainInfo.label}</p>
                            <p className="text-xs text-gray-500">{domainInfo.desc}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {EQUIP_LEVELS.map((lvl) => {
                            const active = input.levels[d] === lvl.id;
                            return (
                              <button
                                key={lvl.id}
                                type="button"
                                onClick={() => updateLevel(d, lvl.id)}
                                className={`p-3 rounded-lg border-2 text-center transition ${
                                  active
                                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                    : 'border-gray-200 hover:border-emerald-300'
                                }`}
                              >
                                <p className={`font-bold text-sm ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                                  {lvl.label}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{lvl.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ============ ÉTAPE 4 : RÉCAPITULATIF ============ */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                      <FaCheckCircle /> Récapitulatif
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-[#050B16] mb-1">Besoins :</p>
                        <div className="flex flex-wrap gap-2">
                          {input.domains.map((d) => (
                            <span
                              key={d}
                              className="bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                            >
                              {DOMAINS.find((x) => x.id === d)?.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {requiredFields.needsBuilding && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Bâtiment :</span>{' '}
                          {PROJECT_TYPES.find((p) => p.id === input.projectType)?.label}
                          {requiredFields.needsSurface && ` · ${input.surface} m²`}
                          {requiredFields.needsRooms && ` · ${input.rooms} pièces`}
                          {requiredFields.needsFloors && ` · ${input.floors} niveau(x)`}
                        </p>
                      )}

                      {requiredFields.needsPerimeter && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Périmètre :</span> {input.perimeter} m
                        </p>
                      )}

                      {requiredFields.needsGate && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Portails :</span> {input.gateCount}{' '}
                          {input.gateType === 'sliding' ? 'coulissant(s)' : 'battant(s)'}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-3 text-lg"
                  >
                    🚀 Générer mon estimation
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
                  disabled={step === 1}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <FaArrowLeft size={12} /> Précédent
                </button>
                {step < 4 && (
                  <button
                    type="button"
                    onClick={() => canGoNext() && setStep((s) => Math.min(4, s + 1) as any)}
                    disabled={!canGoNext()}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition"
                  >
                    Suivant <FaArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            RÉSULTATS
        ================================================================== */}
        {showResults && results && (
          <div id="configurator-results" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Votre estimation
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#050B16] mt-1">
                    Liste d'équipements
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {results.items.length} références · {results.totals.count} unités
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition border border-gray-200 hover:border-emerald-300 px-4 py-2 rounded-lg"
                >
                  <FaRedo size={11} /> Reconfigurer
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-xl p-5 shadow-lg">
                  <p className="text-xs uppercase tracking-widest opacity-90 mb-1">Budget estimé</p>
                  <p className="text-3xl font-bold">{formatPrice(results.totals.grandTotal)}</p>
                  <p className="text-xs opacity-90 mt-1">Équipements + main d'œuvre</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Équipements</p>
                  <p className="text-2xl font-bold text-[#050B16]">{formatPrice(results.totals.subtotal)}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Main d'œuvre</p>
                  <p className="text-2xl font-bold text-[#050B16]">{formatPrice(results.totals.labor)}</p>
                  <p className="text-xs text-gray-500 mt-1">≈ {results.totals.laborHours} h</p>
                </div>
              </div>
            </div>

            {results.totals.laborByTrade && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#050B16] mb-4">🛠️ Main d'œuvre par corps de métier</h3>
                <div className="space-y-2">
                  {Object.entries(results.totals.laborByTrade).map(([trade, data]: any) => {
                    if (!data || data.hours === 0) return null;
                    return (
                      <div key={trade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-[#050B16]">{TRADE_LABELS[trade] || trade}</span>
                        <span className="text-sm text-gray-500">{Math.round(data.hours)} h</span>
                        <span className="font-bold text-emerald-600">{formatPrice(data.amount)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-[#050B16]">Détail des équipements</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {results.items.map((item, i) => (
                  <div key={i} className="p-4 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-[#050B16]">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        {item.category}
                        {item.note && ` · ${item.note}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Qté</p>
                        <p className="font-bold text-[#050B16]">× {item.quantity}</p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-emerald-600">{formatPrice(item.total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleRequestQuote}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
              >
                <FaFileAlt size={14} /> Demander un devis
              </button>
              <a
                href={`https://wa.me/237697654023?text=${encodeURIComponent(
                  `Bonjour, voici mon projet : ${input.domains.length} besoin(s) sélectionné(s). Je souhaite un devis.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
              >
                <FaWhatsapp size={16} /> WhatsApp
              </a>
              <Link
                href="/boutique"
                className="bg-[#050B16] hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-3"
              >
                <FaShoppingCart size={14} /> Boutique
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}