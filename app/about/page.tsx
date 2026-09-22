'use client';

import { useLanguage } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('aboutTitle')}</h1>
      <div className="prose max-w-none">
        <p>CHEFFBUILD Smart Systems est une entreprise camerounaise spécialisée dans l’intégration technologique du bâtiment.</p>
        <p>Nous bâtissons, connectons, sécurisons et automatisons les espaces des particuliers, des résidences et des PME.</p>
        <h2>{t('mission')}</h2>
        <p>Concevoir des infrastructures techniques fiables, évolutives et accessibles, de la vente des équipements à l’installation et à la maintenance.</p>
        <h2>{t('poles')}</h2>
        <ul>
          <li><strong>CHEFFBUILD ELECTRICAL</strong> : électricité bâtiment et énergie solaire</li>
          <li><strong>CHEFFBUILD SECURITY</strong> : vidéosurveillance, alarmes, contrôle d’accès, clôture électrique et supervision par IA</li>
          <li><strong>CHEFFBUILD SMART</strong> : domotique, automatisation et Smart Building</li>
          <li><strong>CHEFFBUILD STORE</strong> : vente en ligne d’équipements techniques</li>
        </ul>
        <h2>{t('values')}</h2>
        <ul>
          <li>Expertise technique et solutions adaptées</li>
          <li>Réactivité et qualité d’exécution</li>
          <li>Relation de confiance et accompagnement durable</li>
        </ul>
      </div>
    </div>
  );
}