'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useEffect, ReactNode } from 'react';
import {
  LanguageContext,
  Locale,
  TranslationKey,
  translate,
} from '@/lib/i18n';

// ============================================================================
//  LANGUAGE PROVIDER
//  Fournit le contexte de langue à toute l'application
//  Expose :
//   - locale / setLocale (naming standard)
//   - language / setLanguage (alias pour compatibilité avec LanguageSwitcher)
// ============================================================================
export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  // Charger la langue sauvegardée au montage
  useEffect(() => {
    const saved = localStorage.getItem('wisbuild-language') as Locale | null;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  // Fonction de changement de langue
  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem('wisbuild-language', nextLocale);
    document.documentElement.lang = nextLocale;
  };

  // Traduction
  const t = (key: TranslationKey) => translate(locale, key);

  // ✅ On passe TOUTES les propriétés attendues par LanguageContextType
  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        language: locale,
        setLanguage: setLocale,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}