'use client';

import Script from 'next/script';

export default function BotpressChat() {
  return (
    <>
      {/* Premier script : inject.js nécessaire au fonctionnement du webchat */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress inject.js chargé')}
        onError={() => console.error('Erreur chargement inject.js')}
      />
      {/* Second script : configuration personnalisée de votre bot */}
      <Script
        src="https://files.bpcontent.cloud/2026/06/01/15/20260601152716-KLL3C3FJ.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress config chargée')}
        onError={() => console.error('Erreur chargement config Botpress')}
      />
    </>
  );
}