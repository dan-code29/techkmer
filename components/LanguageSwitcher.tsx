'use client';

import { useLanguage } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded border border-white/30 p-1" aria-label={t('language')}>
      <button type="button" onClick={() => setLocale('fr')} aria-pressed={locale === 'fr'} className={`px-2 py-1 text-xs font-semibold transition ${locale === 'fr' ? 'bg-white text-blue-700' : 'text-white hover:bg-white/15'}`}>
        FR
      </button>
      <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'} className={`px-2 py-1 text-xs font-semibold transition ${locale === 'en' ? 'bg-white text-blue-700' : 'text-white hover:bg-white/15'}`}>
        EN
      </button>
    </div>
  );
}
