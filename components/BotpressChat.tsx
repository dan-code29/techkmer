'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    // Fonction pour forcer la configuration dès que Botpress est prêt
    const forceBotpressConfig = () => {
      // On vérifie si l'objet botpress existe sur la page
      if (typeof window !== 'undefined' && (window as any).botpress) {
        const botpress = (window as any).botpress;
        
        // On écrase la configuration avec notre image (URL absolue)
        botpress.config({
          configuration: {
            fabImage: 'https://techkmer.vercel.app/images/danielpp.jpg',
            botAvatar: 'https://techkmer.vercel.app/images/danielpp.jpg',
          }
        });
        console.log('✅ Configuration Botpress forcée avec la nouvelle image');
      }
    };

    // On attend que le script inject.js soit chargé pour appeler la config
    // On vérifie toutes les 500ms pendant 10 secondes max
    let attempts = 0;
    const interval = setInterval(() => {
      forceBotpressConfig();
      attempts++;
      if (attempts > 20) clearInterval(interval); // On arrête après 10s
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Premier script : inject.js (indispensable) */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress inject.js chargé')}
      />
      {/* Second script : config générée par le dashboard */}
      <Script
        src="https://files.bpcontent.cloud/2026/06/01/15/20260601152716-KLL3C3FJ.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress config chargée')}
      />
    </>
  );
}