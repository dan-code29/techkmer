import type { Metadata } from 'next';
import SolutionPage from '@/components/SolutionPage';

export const metadata: Metadata = {
  title: 'Domotique & Smart Building — CHEFFBUILD Smart Systems',
  description: 'Domotique, éclairage intelligent, scénarios et automatisation du bâtiment au Cameroun.',
};

export default function SmartPage() {
  return (
    <SolutionPage
      id="smart"
      label="SMART BUILDING"
      title="Domotique & Smart Building"
      subtitle="Éclairage connecté, scénarios automatiques et contrôle à distance."
      description="CHEFFBUILD SMART transforme votre bâtiment en espace intelligent. Éclairage automatisé, volets motorisés, thermostats connectés, scénarios personnalisés : pilotez tout depuis votre smartphone, où que vous soyez."
      heroImage="/images/hero/smart-home.jpg"
      accentColor="cyan"
      subServices={[
        { icon: '💡', title: 'Éclairage intelligent', desc: 'Pilotage individuel ou par zone, scénarios, détection de présence.' },
        { icon: '🎛️', title: 'Scénarios personnalisés', desc: 'Matin, soir, absence, vacances — automatisez votre quotidien.' },
        { icon: '🌡️', title: 'Climatisation & chauffage', desc: 'Thermostats intelligents et gestion énergétique optimisée.' },
        { icon: '🚪', title: 'Volets & stores', desc: 'Motorisation, ouverture automatique selon l\'ensoleillement.' },
        { icon: '📱', title: 'Contrôle à distance', desc: 'Application mobile, commandes vocales, alertes.' },
        { icon: '🧠', title: 'Passerelle centralisée', desc: 'Intégration multi-protocoles KNX, Zigbee, Wi-Fi.' },
      ]}
      productCategories={['Smart Home']}
      benefits={[
        'Solution évolutive et modulaire',
        'Intégration avec vos équipements existants',
        'Économies d\'énergie jusqu\'à 30%',
        'Contrôle à distance sécurisé',
        'Installation discrète et propre',
        'Formation à l\'utilisation incluse',
      ]}
    />
  );
}