'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function BotpressChat() {
  useEffect(() => {
    // La nouvelle image que l'on veut forcer (relative à ton site)
    const NEW_IMAGE_PATH = '/images/danielpp.jpg';

    // Fonction qui va chercher le bouton et changer l'image
    const replaceBotpressImages = () => {
      // 1. Remplacer l'image du bouton flottant (FAB)
      const fabImages = document.querySelectorAll('.bpFabImage');
      fabImages.forEach((img: any) => {
        if (img.src && !img.src.includes('danielpp.jpg')) {
          img.src = NEW_IMAGE_PATH;
          img.srcset = NEW_IMAGE_PATH; // On nettoie aussi le srcset
        }
      });

      // 2. Remplacer l'avatar dans l'en-tête du chat
      const headerAvatars = document.querySelectorAll('.bpHeaderAvatar, .bpChatHeaderAvatar, img[alt="Bot"]');
      headerAvatars.forEach((img: any) => {
        if (img.src && !img.src.includes('danielpp.jpg')) {
          img.src = NEW_IMAGE_PATH;
        }
      });
    };

    // On lance un "observateur" qui vérifie régulièrement si Botpress a chargé
    // (Car le chat met quelques secondes à s'initialiser)
    const interval = setInterval(replaceBotpressImages, 500);

    // On nettoie l'intervalle quand l'utilisateur quitte la page
    return () => clearInterval(interval);
  }, []);

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