import type { Metadata } from 'next';
import SolutionPage from '@/components/SolutionPage';

export const metadata: Metadata = {
  title: 'Réseaux & Informatique — CHEFFBUILD Smart Systems',
  description: 'Câblage réseau, Wi-Fi professionnel, baies de brassage, téléphonie IP au Cameroun.',
};

export default function ConnectivityPage() {
  return (
    <SolutionPage
      id="connectivity"
      label="CONNECTIVITY"
      title="Réseaux & Informatique"
      subtitle="Câblage structuré, Wi-Fi pro, baies de brassage et infrastructure IT."
      description="CHEFFBUILD CONNECTIVITY déploie et optimise l'ensemble de vos infrastructures réseau. Câblage RJ45 et fibre, baies de brassage, Wi-Fi professionnel et téléphonie IP : nous concevons des réseaux fiables, rapides et évolutifs pour vos locaux."
      heroImage="/images/hero/network.jpg"
      accentColor="blue"
      subServices={[
        { icon: '🌐', title: 'Câblage structuré', desc: 'RJ45 Cat6, fibre optique, chemins de câbles et goulottes.' },
        { icon: '📡', title: 'Wi-Fi professionnel', desc: 'Points d\'accès, couverture étendue, roaming transparent.' },
        { icon: '🗄️', title: 'Baies de brassage', desc: 'Baies 9U à 42U équipées, switchs, patch panels.' },
        { icon: '📞', title: 'Téléphonie IP', desc: 'Standard téléphonique, postes IP, interconnexion.' },
        { icon: '💾', title: 'Serveurs & NAS', desc: 'Installation, configuration, sauvegarde automatisée.' },
        { icon: '🔐', title: 'Sécurité réseau', desc: 'Firewall, VPN, segmentation VLAN, surveillance.' },
      ]}
      productCategories={['Networking']}
      benefits={[
        'Audit réseau complet avant intervention',
        'Installation propre avec documentation livrée',
        'Wi-Fi 6 / 6E pour des débits optimaux',
        'Matériel professionnel (TP-Link, Ubiquiti…)',
        'Intervention rapide sur site',
        'Contrats de maintenance disponibles',
      ]}
    />
  );
}