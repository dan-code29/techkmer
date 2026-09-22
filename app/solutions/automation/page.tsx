import type { Metadata } from 'next';
import SolutionPage from '@/components/SolutionPage';

export const metadata: Metadata = {
  title: 'Automatisation — CHEFFBUILD Smart Systems',
  description: 'Motorisation de portails, portes automatiques, barrières au Cameroun.',
};

export default function AutomationPage() {
  return (
    <SolutionPage
      id="automation"
      label="AUTOMATION"
      title="Automatisation"
      subtitle="Portails motorisés, portes automatiques, barrières et automatisation industrielle."
      description="CHEFFBUILD AUTOMATION motorise et automatise l'ensemble de vos accès. Portails coulissants ou battants, portes de garage, barrières automatiques : bénéficiez d'un confort optimal et d'une sécurité renforcée, avec contrôle à distance."
      heroImage="/images/hero/automation.jpg"
      accentColor="purple"
      subServices={[
        { icon: '🚪', title: 'Portails motorisés', desc: 'Coulissants ou battants jusqu\'à 800 kg, télécommande et application.' },
        { icon: '🏠', title: 'Portes de garage', desc: 'Motorisation, éclairage intégré, sécurité anti-pincement.' },
        { icon: '🚧', title: 'Barrières automatiques', desc: 'Parkings, résidences, sites industriels.' },
        { icon: '📱', title: 'Contrôle à distance', desc: 'Ouverture depuis smartphone, gestion multi-utilisateurs.' },
        { icon: '🔒', title: 'Sécurité intégrée', desc: 'Cellules photoélectriques, feux clignotants, arrêt d\'urgence.' },
        { icon: '⚙️', title: 'Maintenance préventive', desc: 'Contrats d\'entretien pour garantir la fiabilité.' },
      ]}
      productCategories={['Automation']}
      benefits={[
        'Motorisations professionnelles et durables',
        'Installation conforme aux normes de sécurité',
        'Télécommandes et application mobile incluses',
        'Sécurité anti-pincement et détection d\'obstacle',
        'Intervention rapide en cas de panne',
        'Garantie 12 mois pièces et main d\'œuvre',
      ]}
    />
  );
}