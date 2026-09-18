'use client';

import { useEffect, useState } from 'react';
import { LanguageContext, Locale, translate } from '@/lib/i18n';

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    const savedLocale = window.localStorage.getItem('wisebuild-locale');
    if (savedLocale === 'en' || savedLocale === 'fr') setLocaleState(savedLocale);
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem('wisebuild-locale', nextLocale);
    document.documentElement.lang = nextLocale;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LanguageContext.Provider value={{ locale, setLocale, t: (key) => translate(locale, key) }}>{children}</LanguageContext.Provider>;
}
