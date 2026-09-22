'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useContext, createContext } from 'react';

// ============================================================================
//  TYPES
// ============================================================================
export type Locale = 'fr' | 'en';

type TranslationValue = string;

// ============================================================================
//  TRADUCTIONS (FR + EN)
// ============================================================================
const translations = {
  // ==========================================================================
  //  FRANÇAIS
  // ==========================================================================
  fr: {
    // ---- Navigation ----
    home: 'Accueil',
    services: 'Services',
    installation: 'Installation',
    maintenance: 'Maintenance',
    store: 'Boutique',
    quote: 'Devis',
    cart: 'Panier',
    login: 'Connexion',
    logout: 'Déconnexion',
    admin: 'Admin',
    about: 'À propos',              // ✅ AJOUTÉ
    contact: 'Contact',              // ✅ AJOUTÉ
    configurator: 'Configurateur',   // ✅ AJOUTÉ
    projects: 'Nos réalisations',

    // ---- Tagline / Hero ----
    tagline: 'Building • Energy • Connectivity • Automation • Security',
    heroEyebrow: 'CHEFFBUILD SMART SYSTEMS',
    heroTitle: 'Des bâtiments plus sûrs. Plus connectés. Plus intelligents.',
    heroText:
      "Nous bâtissons, connectons, sécurisons et automatisons vos espaces grâce à des solutions intégrées d'électricité, d'énergie, de réseau et de sécurité.",
    talkProject: 'Parler de votre projet',
    discoverStore: 'Découvrir la boutique',
    discoverPole: 'Explorer le pôle →',

    // ---- Expertises ----
    expertise: 'Notre expertise',
    fourPoles: 'Un intégrateur, quatre pôles complémentaires',
    expertiseText:
      "De l'équipement à la maintenance, CHEFFBUILD accompagne chaque étape de vos projets techniques.",
    electrical: 'CHEFFBUILD ELECTRICAL',
    electricalText:
      'Électricité bâtiment, rénovation, maintenance et solutions solaires pour gagner en autonomie énergétique.',
    security: 'CHEFFBUILD SECURITY',
    securityText:
      "Vidéosurveillance, alarmes, contrôle d'accès, clôtures électriques et supervision intelligente.",
    smart: 'CHEFFBUILD SMART',
    smartText:
      'Domotique, automatisation des portails, éclairage connecté et solutions Smart Building.',
    storePole: 'CHEFFBUILD STORE',
    storeText:
      "Une sélection d'équipements électriques, réseau, CCTV, solaire et domotique disponibles en ligne.",

    // ---- Qui sommes-nous ----
    whoWeAre: 'Qui sommes-nous ?',
    aboutText:
      "CHEFFBUILD Smart Systems est une entreprise d'intégration technologique du bâtiment. Nous concevons, installons et maintenons des infrastructures électriques, solaires, réseau, de sécurité électronique et de domotique pour les PME et les résidences.",
    learnMore: 'En savoir plus →',

    // ---- Projets / CTA ----
    projectQuestion: 'Vous avez un projet ?',
    projectText: 'Contactez-nous pour un devis personnalisé.',
    getQuote: 'Obtenir un devis',

    // ---- Boutique ----
    shopTitle: 'Notre boutique',
    loading: 'Chargement...',
    allProducts: 'Tous les articles',
    sortBy: 'Trier par :',
    defaultSort: 'Par défaut',
    priceAsc: 'Prix croissant',
    priceDesc: 'Prix décroissant',
    bestSeller: 'Meilleures ventes',
    addCart: 'Ajouter au panier',
    addedCart: 'ajouté au panier !',
    noProduct: 'Aucun produit trouvé.',

    // ---- Devis ----
    quoteTitle: 'Demandez votre devis gratuit',
    quoteIntro:
      "Des solutions sur mesure pour vos projets d'électricité, réseau, domotique et sécurité électronique.",
    startQuote: 'Commencer mon devis',
    quickResponse: 'Réponse rapide',
    within24: 'Sous 24h',
    noCommitment: 'Devis sans engagement',
    freeAssessment: 'Évaluation gratuite',
    guaranteedExpertise: 'Expertise garantie',
    expertAdvice: "Conseils d'experts",
    formTitle: 'Remplissez vos informations',
    sendQuote: 'Demander un devis',
    sending: 'Envoi en cours...',
    required: '* Champs obligatoires',

    // ---- À propos ----
    aboutTitle: 'À propos de CHEFFBUILD Smart Systems',
    mission: 'Notre mission',
    poles: 'Nos quatre pôles',
    values: 'Nos valeurs',

    // ---- Langue ----
    language: 'Langue',
    french: 'Français',
    english: 'English',
  },

  // ==========================================================================
  //  ENGLISH
  // ==========================================================================
  en: {
    // ---- Navigation ----
    home: 'Home',
    services: 'Services',
    installation: 'Installation',
    maintenance: 'Maintenance',
    store: 'Store',
    quote: 'Quote',
    cart: 'Cart',
    login: 'Sign in',
    logout: 'Sign out',
    admin: 'Admin',
    about: 'About',                  // ✅ AJOUTÉ
    contact: 'Contact',              // ✅ AJOUTÉ
    configurator: 'Configurator',    // ✅ AJOUTÉ
    projects: 'Our projects',

    // ---- Tagline / Hero ----
    tagline: 'Building • Energy • Connectivity • Automation • Security',
    heroEyebrow: 'CHEFFBUILD SMART SYSTEMS',
    heroTitle: 'Safer. More connected. Smarter buildings.',
    heroText:
      'We build, connect, secure and automate your spaces with integrated electrical, energy, networking and security solutions.',
    talkProject: 'Discuss your project',
    discoverStore: 'Explore the store',
    discoverPole: 'Explore the division →',

    // ---- Expertises ----
    expertise: 'Our expertise',
    fourPoles: 'One integrator, four complementary divisions',
    expertiseText:
      'From equipment supply to maintenance, CHEFFBUILD supports every stage of your technical projects.',
    electrical: 'CHEFFBUILD ELECTRICAL',
    electricalText:
      'Building electrical systems, renovation, maintenance and solar solutions for greater energy independence.',
    security: 'CHEFFBUILD SECURITY',
    securityText:
      'Video surveillance, alarms, access control, electric fencing and intelligent monitoring.',
    smart: 'CHEFFBUILD SMART',
    smartText:
      'Home automation, gate automation, connected lighting and Smart Building solutions.',
    storePole: 'CHEFFBUILD STORE',
    storeText:
      'A selection of electrical, networking, CCTV, solar, automation and security equipment available online.',

    // ---- Who we are ----
    whoWeAre: 'Who we are',
    aboutText:
      'CHEFFBUILD Smart Systems is a building technology integration company. We design, install and maintain electrical, solar, networking, electronic security and automation infrastructure for SMEs and homes.',
    learnMore: 'Learn more →',

    // ---- Projects / CTA ----
    projectQuestion: 'Have a project?',
    projectText: 'Contact us for a tailored quote.',
    getQuote: 'Get a quote',

    // ---- Shop ----
    shopTitle: 'Our store',
    loading: 'Loading...',
    allProducts: 'All products',
    sortBy: 'Sort by:',
    defaultSort: 'Default',
    priceAsc: 'Price: low to high',
    priceDesc: 'Price: high to low',
    bestSeller: 'Best sellers',
    addCart: 'Add to cart',
    addedCart: 'added to cart!',
    noProduct: 'No products found.',

    // ---- Quote ----
    quoteTitle: 'Request your free quote',
    quoteIntro:
      'Tailored solutions for your electrical, networking, automation and electronic security projects.',
    startQuote: 'Start my quote',
    quickResponse: 'Fast response',
    within24: 'Within 24 hours',
    noCommitment: 'No-obligation quote',
    freeAssessment: 'Free assessment',
    guaranteedExpertise: 'Guaranteed expertise',
    expertAdvice: 'Expert advice',
    formTitle: 'Fill in your details',
    sendQuote: 'Request a quote',
    sending: 'Sending...',
    required: '* Required fields',

    // ---- About ----
    aboutTitle: 'About CHEFFBUILD Smart Systems',
    mission: 'Our mission',
    poles: 'Our four divisions',
    values: 'Our values',

    // ---- Language ----
    language: 'Language',
    french: 'Français',
    english: 'English',
  },
} satisfies Record<Locale, Record<string, TranslationValue>>;

// ============================================================================
//  TYPES DÉRIVÉS
// ============================================================================
export type Translations = typeof translations.fr;
export type TranslationKey = keyof typeof translations.fr;

// ============================================================================
//  CONTEXTE DE LANGUE
//  Expose à la fois :
//   - locale / setLocale (naming standard)
//   - language / setLanguage (alias pour compatibilité)
// ============================================================================
type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Alias pour compatibilité avec l'ancien naming
  language: Locale;
  setLanguage: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

export const LanguageContext = createContext<LanguageContextType>({
  locale: 'fr',
  setLocale: () => undefined,
  language: 'fr',
  setLanguage: () => undefined,
  t: (key) => translations.fr[key],
});

// ============================================================================
//  HOOK : useLanguage
// ============================================================================
export function useLanguage() {
  return useContext(LanguageContext);
}

// ============================================================================
//  FONCTION UTILITAIRE : translate
// ============================================================================
export function translate(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.fr[key];
}

// ============================================================================
//  EXPORT PAR DÉFAUT
// ============================================================================
export default translations;