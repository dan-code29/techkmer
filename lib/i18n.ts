'use client';

import { useContext, createContext } from 'react';

export type Locale = 'fr' | 'en';

type TranslationValue = string;
type TranslationKey = keyof typeof translations.fr;

const translations = {
  fr: {
    home: 'Accueil', services: 'Services', installation: 'Installation', maintenance: 'Maintenance', store: 'Boutique', quote: 'Devis', cart: 'Panier', login: 'Connexion', logout: 'Déconnexion', admin: 'Admin',
    tagline: 'Building • Energy • Connectivity • Automation • Security',
    heroEyebrow: 'WISEBUILD SMART SYSTEMS', heroTitle: 'Des bâtiments plus sûrs. Plus connectés. Plus intelligents.',
    heroText: "Nous bâtissons, connectons, sécurisons et automatisons vos espaces grâce à des solutions intégrées d'électricité, d'énergie, de réseau et de sécurité.",
    talkProject: 'Parler de votre projet', discoverStore: 'Découvrir la boutique', discoverPole: 'Explorer le pôle →',
    expertise: 'Notre expertise', fourPoles: 'Un intégrateur, quatre pôles complémentaires',
    expertiseText: "De l'équipement à la maintenance, WISEBUILD accompagne chaque étape de vos projets techniques.",
    electrical: 'WISEBUILD ELECTRICAL', electricalText: 'Électricité bâtiment, rénovation, maintenance et solutions solaires pour gagner en autonomie énergétique.',
    security: 'WISEBUILD SECURITY', securityText: "Vidéosurveillance, alarmes, contrôle d'accès, clôtures électriques et supervision intelligente.",
    smart: 'WISEBUILD SMART', smartText: 'Domotique, automatisation des portails, éclairage connecté et solutions Smart Building.',
    storePole: 'WISEBUILD STORE', storeText: "Une sélection d'équipements électriques, réseau, CCTV, solaire et domotique disponibles en ligne.",
    whoWeAre: 'Qui sommes-nous ?', aboutText: "WISEBUILD Smart Systems est une entreprise d'intégration technologique du bâtiment. Nous concevons, installons et maintenons des infrastructures électriques, solaires, réseau, de sécurité électronique et de domotique pour les PME et les résidences.",
    learnMore: 'En savoir plus →', projects: 'Nos réalisations', projectQuestion: 'Vous avez un projet ?', projectText: 'Contactez-nous pour un devis personnalisé.', getQuote: 'Obtenir un devis',
    shopTitle: 'Notre boutique', loading: 'Chargement...', allProducts: 'Tous les articles', sortBy: 'Trier par :', defaultSort: 'Par défaut', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant', bestSeller: 'Meilleures ventes', addCart: 'Ajouter au panier', addedCart: 'ajouté au panier !', noProduct: 'Aucun produit trouvé.',
    quoteTitle: 'Demandez votre devis gratuit', quoteIntro: "Des solutions sur mesure pour vos projets d'électricité, réseau, domotique et sécurité électronique.", startQuote: 'Commencer mon devis', quickResponse: 'Réponse rapide', within24: 'Sous 24h', noCommitment: 'Devis sans engagement', freeAssessment: 'Évaluation gratuite', guaranteedExpertise: 'Expertise garantie', expertAdvice: "Conseils d'experts", formTitle: 'Remplissez vos informations', sendQuote: 'Demander un devis', sending: 'Envoi en cours...', required: '* Champs obligatoires',
    aboutTitle: 'À propos de WISEBUILD Smart Systems', mission: 'Notre mission', poles: 'Nos quatre pôles', values: 'Nos valeurs',
    language: 'Langue', french: 'Français', english: 'English',
  },
  en: {
    home: 'Home', services: 'Services', installation: 'Installation', maintenance: 'Maintenance', store: 'Store', quote: 'Quote', cart: 'Cart', login: 'Sign in', logout: 'Sign out', admin: 'Admin',
    tagline: 'Building • Energy • Connectivity • Automation • Security',
    heroEyebrow: 'WISEBUILD SMART SYSTEMS', heroTitle: 'Safer. More connected. Smarter buildings.',
    heroText: 'We build, connect, secure and automate your spaces with integrated electrical, energy, networking and security solutions.',
    talkProject: 'Discuss your project', discoverStore: 'Explore the store', discoverPole: 'Explore the division →',
    expertise: 'Our expertise', fourPoles: 'One integrator, four complementary divisions',
    expertiseText: 'From equipment supply to maintenance, WISEBUILD supports every stage of your technical projects.',
    electrical: 'WISEBUILD ELECTRICAL', electricalText: 'Building electrical systems, renovation, maintenance and solar solutions for greater energy independence.',
    security: 'WISEBUILD SECURITY', securityText: 'Video surveillance, alarms, access control, electric fencing and intelligent monitoring.',
    smart: 'WISEBUILD SMART', smartText: 'Home automation, gate automation, connected lighting and Smart Building solutions.',
    storePole: 'WISEBUILD STORE', storeText: 'A selection of electrical, networking, CCTV, solar, automation and security equipment available online.',
    whoWeAre: 'Who we are', aboutText: 'WISEBUILD Smart Systems is a building technology integration company. We design, install and maintain electrical, solar, networking, electronic security and automation infrastructure for SMEs and homes.',
    learnMore: 'Learn more →', projects: 'Our projects', projectQuestion: 'Have a project?', projectText: 'Contact us for a tailored quote.', getQuote: 'Get a quote',
    shopTitle: 'Our store', loading: 'Loading...', allProducts: 'All products', sortBy: 'Sort by:', defaultSort: 'Default', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low', bestSeller: 'Best sellers', addCart: 'Add to cart', addedCart: 'added to cart!', noProduct: 'No products found.',
    quoteTitle: 'Request your free quote', quoteIntro: 'Tailored solutions for your electrical, networking, automation and electronic security projects.', startQuote: 'Start my quote', quickResponse: 'Fast response', within24: 'Within 24 hours', noCommitment: 'No-obligation quote', freeAssessment: 'Free assessment', guaranteedExpertise: 'Guaranteed expertise', expertAdvice: 'Expert advice', formTitle: 'Fill in your details', sendQuote: 'Request a quote', sending: 'Sending...', required: '* Required fields',
    aboutTitle: 'About WISEBUILD Smart Systems', mission: 'Our mission', poles: 'Our four divisions', values: 'Our values',
    language: 'Language', french: 'Français', english: 'English',
  },
} satisfies Record<Locale, Record<string, TranslationValue>>;

export type Translations = typeof translations.fr;
export const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: (key: TranslationKey) => string }>({
  locale: 'fr',
  setLocale: () => undefined,
  t: (key) => translations.fr[key],
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function translate(locale: Locale, key: TranslationKey) {
  return translations[locale][key] || translations.fr[key];
}
