'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    const forceBotpressConfig = () => {
      if (typeof window !== 'undefined' && (window as any).botpress) {
        const botpress = (window as any).botpress;
        const currentDomain = window.location.origin; 
        
        // Chemin vers l'image qui se trouve directement dans le dossier public
        const myImageUrl = `${currentDomain}/danielpp.jpg`;

        botpress.config({
          configuration: {
            fabImage: myImageUrl,
            botAvatar: myImageUrl,
          }
        });
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
      {/* 👇 LES SCRIPTS DE TON EMBED CODE (Version 3.7) 👇 */}
      {/* Remplace le lien ci-dessous par le lien complet de ton premier script */}
     
    <script src="https://cdn.botpress.cloud/webchat/v3.7/inject.js"></script>
<script src="https://files.bpcontent.cloud/2026/06/01/15/20260601152716-KLL3C3FJ.js" defer></script>
    

      {/* CSS DE SECOURS POUR L'IMAGE */}
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