import type { Metadata } from 'next';
import SolutionPage from '@/components/SolutionPage';

export const metadata: Metadata = {
  title: 'Électricité & Solaire — CHEFFBUILD Smart Systems',
  description: 'Installation électrique, panneaux solaires, onduleurs, batteries, mise aux normes au Cameroun.',
};

export default function ElectricalPage() {
  return (
    <SolutionPage
      id="electrical"
      label="ENERGY"
      title="Électricité & Solaire"
      subtitle="Installation, mise aux normes, énergie solaire et autonomie énergétique."
      description="CHEFFBUILD ELECTRICAL conçoit, installe et maintient l'ensemble de vos systèmes électriques et solaires. De la mise aux normes à l'installation complète de panneaux photovoltaïques avec batteries et onduleurs, nous vous accompagnons pour gagner en autonomie et en sécurité."
      heroImage="/images/hero/electrical.jpg"
      accentColor="amber"
      subServices={[
        { icon: '⚡', title: 'Installation électrique', desc: 'Câblage complet, tableaux, prises, éclairage pour neuf et rénovation.' },
        { icon: '🔧', title: 'Mise aux normes', desc: 'Diagnostic et remise en conformité de vos installations existantes.' },
        { icon: '☀️', title: 'Panneaux solaires', desc: 'Installation photovoltaïque : panneaux, onduleurs, régulateurs MPPT.' },
        { icon: '🔋', title: 'Batteries & autonomie', desc: 'Solutions de stockage lithium pour une autonomie complète.' },
        { icon: '📊', title: 'Monitoring', desc: 'Suivi à distance de votre production et consommation énergétique.' },
        { icon: '🔌', title: 'Éclairage LED', desc: 'Solutions d\'éclairage professionnel basse consommation.' },
      ]}
      productCategories={['Electrical', 'Solar Energy']}
      benefits={[
        'Techniciens certifiés et expérimentés',
        'Installation conforme aux normes NF C 15-100',
        'Matériel de marques reconnues (Schneider, Legrand…)',
        'Garantie 12 mois sur l\'installation et le matériel',
        'Service après-vente réactif',
        'Devis transparent et détaillé',
      ]}
    />
  );
}