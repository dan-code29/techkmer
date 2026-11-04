'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    // Fonction pour forcer la configuration
    const forceBotpressConfig = () => {
      if (typeof window !== 'undefined' && (window as any).botpress) {
        const botpress = (window as any).botpress;
        
        // On récupère l'adresse actuelle (localhost:3000 ou vercel)
        const currentDomain = window.location.origin; 
        
        // 👇 CORRECTION ICI : On retire "/images/" car l'image est directement dans public/
        const myImageUrl = `${currentDomain}/danielpp.jpg`;

        botpress.config({
          configuration: {
            fabImage: myImageUrl,
            botAvatar: myImageUrl,
          }
        });
        console.log('✅ Configuration Botpress forcée avec :', myImageUrl);
      }
    };

    let attempts = 0;
    const interval = setInterval(() => {
      forceBotpressConfig();
      attempts++;
      if (attempts > 20) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress inject.js chargé')}
      />
      <Script
        src="https://files.bpcontent.cloud/2026/06/01/15/20260601152716-KLL3C3FJ.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Botpress config chargée')}
      />

      {/* 👇 CSS DE SECOURS : Force l'image même si le script de Botpress échoue */}
      <style jsx global>{`
        .bpFabImage {
          content: url('/danielpp.jpg') !important;
          border-radius: 50% !important;
          object-fit: cover !important;
        }
        .bpHeaderAvatar, .bpChatHeaderAvatar {
          content: url('/danielpp.jpg') !important;
        }
      `}</style>
    </>
  );
}