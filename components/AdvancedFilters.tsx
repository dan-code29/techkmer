'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import { FaTimes, FaFilter, FaCheck, FaChevronDown } from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
export type Filters = {
  priceMin: number;
  priceMax: number;
  brands: string[];
  availability: 'all' | 'in-stock' | 'on-order';
  promoOnly: boolean;
};

// ============================================================================
//  LISTE DES MARQUES DISPONIBLES
//  Modifiez cette liste selon vos vrais partenaires
// ============================================================================
const AVAILABLE_BRANDS = [
  'Schneider Electric',
  'Legrand',
  'Hikvision',
  'Dahua',
  'TP-Link',
  'Ubiquiti',
  'Shelly',
  'Sonoff',
  'ABB',
  'Siemens',
  'Philips',
  'Bosch',
  'Eaton',
  'Gewiss',
  'Gira',
  'Lutron',
];

// ============================================================================
//  FILTRES PAR DÉFAUT (aucun filtre actif)
// ============================================================================
export const DEFAULT_FILTERS: Filters = {
  priceMin: 0,
  priceMax: 500000,
  brands: [],
  availability: 'all',
  promoOnly: false,
};

// ============================================================================
//  COMPOSANT PRINCIPAL : AdvancedFilters
//  Panneau de filtres avancés avec :
//    - Prix min/max + slider
//    - Marques (checkboxes)
//    - Disponibilité (radio)
//    - Promotions uniquement (toggle)
// ============================================================================
export default function AdvancedFilters({
  filters,
  onChange,
  onClose,
  maxPrice,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose?: () => void;
  maxPrice: number;
}) {
  // État local : on modifie les filtres en local puis on les applique
  const [local, setLocal] = useState<Filters>(filters);

  // Accordéons : quelles sections sont ouvertes/fermées
  const [openSections, setOpenSections] = useState({
    price: true,
    brands: true,
    availability: true,
    promo: true,
  });

  // Synchroniser l'état local quand les props changent (ex: reset externe)
  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  // ---------------------------------------------------------------------------
  //  Bascule l'ouverture/fermeture d'une section
  // ---------------------------------------------------------------------------
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ---------------------------------------------------------------------------
  //  Applique les filtres (remonte au parent)
  // ---------------------------------------------------------------------------
  const apply = () => {
    onChange(local);
    onClose?.();
  };

  // ---------------------------------------------------------------------------
  //  Réinitialise tous les filtres
  // ---------------------------------------------------------------------------
  const reset = () => {
    const cleared = { ...DEFAULT_FILTERS, priceMax: maxPrice };
    setLocal(cleared);
    onChange(cleared);
  };

  // ---------------------------------------------------------------------------
  //  Ajoute / retire une marque de la sélection
  // ---------------------------------------------------------------------------
  const toggleBrand = (brand: string) => {
    setLocal((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  // ---------------------------------------------------------------------------
  //  Formate un prix en FCFA
  // ---------------------------------------------------------------------------
  const formatFCFA = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  // ---------------------------------------------------------------------------
  //  Compteur de filtres actifs (affiché dans le header)
  // ---------------------------------------------------------------------------
  const activeFiltersCount =
    (local.priceMin > 0 || local.priceMax < maxPrice ? 1 : 0) +
    (local.brands.length > 0 ? 1 : 0) +
    (local.availability !== 'all' ? 1 : 0) +
    (local.promoOnly ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* ============================================================= */}
      {/*  HEADER                                                       */}
      {/* ============================================================= */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#050B16] to-[#0a1a3a] text-white">
        <h3 className="font-bold flex items-center gap-2">
          <FaFilter size={14} className="text-[#00C2FF]" />
          Filtres
          {activeFiltersCount > 0 && (
            <span className="bg-[#00C2FF] text-[#050B16] text-[10px] font-bold rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white lg:hidden"
            aria-label="Fermer"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>

      {/* ============================================================= */}
      {/*  CORPS DU PANNEAU                                             */}
      {/* ============================================================= */}
      <div className="max-h-[70vh] overflow-y-auto">

        {/* =========================================================== */}
        {/*  SECTION 1 : PRIX                                            */}
        {/* =========================================================== */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
          >
            <span className="text-xs font-bold text-[#050B16] uppercase tracking-wide">
              Prix (FCFA)
            </span>
            <FaChevronDown
              size={10}
              className={`text-gray-400 transition-transform ${
                openSections.price ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.price && (
            <div className="px-5 pb-5 space-y-4">
              {/* Inputs min / max */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={local.priceMin}
                    onChange={(e) =>
                      setLocal({ ...local, priceMin: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <span className="text-gray-400 text-sm mt-5">—</span>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={local.priceMax}
                    onChange={(e) =>
                      setLocal({ ...local, priceMax: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder={String(maxPrice)}
                  />
                </div>
              </div>

              {/* Slider pour le max */}
              <div>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={local.priceMax}
                  onChange={(e) =>
                    setLocal({ ...local, priceMax: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>0 FCFA</span>
                  <span>{formatFCFA(maxPrice)}</span>
                </div>
              </div>

              {/* Récapitulatif de la sélection */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800">
                Fourchette : <strong>{formatFCFA(local.priceMin)}</strong> à{' '}
                <strong>{formatFCFA(local.priceMax)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================== */}
        {/*  SECTION 2 : MARQUES                                         */}
        {/* =========================================================== */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
          >
            <span className="text-xs font-bold text-[#050B16] uppercase tracking-wide flex items-center gap-2">
              Marques
              {local.brands.length > 0 && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] rounded-full px-2 py-0.5">
                  {local.brands.length}
                </span>
              )}
            </span>
            <FaChevronDown
              size={10}
              className={`text-gray-400 transition-transform ${
                openSections.brands ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.brands && (
            <div className="px-5 pb-5 space-y-1 max-h-56 overflow-y-auto">
              {AVAILABLE_BRANDS.map((brand) => {
                const checked = local.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer text-sm hover:bg-gray-50 rounded-lg px-2 py-2 transition"
                  >
                    {/* Checkbox custom */}
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {checked && <FaCheck size={9} className="text-white" />}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(brand)}
                      className="sr-only"
                    />
                    <span className="text-gray-700 truncate">{brand}</span>
                  </label>
                );
              })}

              {/* Bouton effacer les marques */}
              {local.brands.length > 0 && (
                <button
                  onClick={() => setLocal({ ...local, brands: [] })}
                  className="text-[10px] text-red-500 hover:underline mt-2"
                >
                  Effacer les marques
                </button>
              )}
            </div>
          )}
        </div>

        {/* =========================================================== */}
        {/*  SECTION 3 : DISPONIBILITÉ                                   */}
        {/* =========================================================== */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
          >
            <span className="text-xs font-bold text-[#050B16] uppercase tracking-wide">
              Disponibilité
            </span>
            <FaChevronDown
              size={10}
              className={`text-gray-400 transition-transform ${
                openSections.availability ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.availability && (
            <div className="px-5 pb-5 space-y-2">
              {[
                { v: 'all', l: 'Tous les produits', icon: '📦' },
                { v: 'in-stock', l: 'En stock', icon: '✓' },
                { v: 'on-order', l: 'Sur commande', icon: '⏳' },
              ].map((opt) => {
                const active = local.availability === opt.v;
                return (
                  <label
                    key={opt.v}
                    className={`flex items-center gap-3 cursor-pointer text-sm rounded-lg px-3 py-2.5 transition border ${
                      active
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    {/* Radio custom */}
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                        active
                          ? 'border-emerald-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="availability"
                      checked={active}
                      onChange={() =>
                        setLocal({ ...local, availability: opt.v as any })
                      }
                      className="sr-only"
                    />
                    <span className="mr-1">{opt.icon}</span>
                    <span
                      className={`flex-1 ${
                        active ? 'text-emerald-800 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {opt.l}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================== */}
        {/*  SECTION 4 : PROMOTIONS UNIQUEMENT                           */}
        {/* =========================================================== */}
        <div>
          <button
            onClick={() => toggleSection('promo')}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
          >
            <span className="text-xs font-bold text-[#050B16] uppercase tracking-wide">
              Promotions
            </span>
            <FaChevronDown
              size={10}
              className={`text-gray-400 transition-transform ${
                openSections.promo ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.promo && (
            <div className="px-5 pb-5">
              <label
                className={`flex items-center gap-3 cursor-pointer text-sm rounded-lg px-3 py-2.5 transition border ${
                  local.promoOnly
                    ? 'bg-red-50 border-red-200'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Checkbox custom */}
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${
                    local.promoOnly
                      ? 'bg-red-500 border-red-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {local.promoOnly && <FaCheck size={9} className="text-white" />}
                </span>
                <input
                  type="checkbox"
                  checked={local.promoOnly}
                  onChange={(e) =>
                    setLocal({ ...local, promoOnly: e.target.checked })
                  }
                  className="sr-only"
                />
                <span className="text-lg">🔥</span>
                <span
                  className={`flex-1 ${
                    local.promoOnly
                      ? 'text-red-800 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  En promotion uniquement
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/*  ACTIONS (Appliquer / Réinitialiser)                          */}
      {/* ============================================================= */}
      <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={reset}
          className="flex-1 text-sm font-semibold text-gray-600 hover:text-gray-800 py-2.5 rounded-lg border border-gray-200 hover:bg-white transition"
        >
          Réinitialiser
        </button>
        <button
          onClick={apply}
          className="flex-1 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}