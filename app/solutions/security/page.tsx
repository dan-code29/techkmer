import type { Metadata } from 'next';
import SolutionPage from '@/components/SolutionPage';

export const metadata: Metadata = {
  title: 'Sécurité électronique — CHEFFBUILD Smart Systems',
  description: 'Vidéosurveillance, alarmes, contrôle d\'accès, clôtures électriques au Cameroun.',
};

export default function SecurityPage() {
  return (
    <SolutionPage
      id="security"
      label="SECURITY"
      title="Sécurité électronique"
      subtitle="Vidéosurveillance, alarmes, contrôle d'accès et clôtures électriques."
      description="CHEFFBUILD SECURITY protège vos espaces avec des solutions de sécurité électronique performantes. Caméras IP, NVR, alarmes, contrôle d'accès par badge ou biométrie, clôtures électriques : nous concevons une protection sur mesure pour particuliers et entreprises."
      heroImage="/images/hero/security.jpg"
      accentColor="red"
      subServices={[
        { icon: '📹', title: 'Vidéosurveillance', desc: 'Caméras IP HD/4K, vision nocturne, monitoring mobile 24/7.' },
        { icon: '🎬', title: 'NVR & stockage', desc: 'Enregistrement local sécurisé, disques 1 à 8 To, redondance.' },
        { icon: '🚨', title: 'Alarme intrusion', desc: 'Détecteurs de mouvement, sirènes, alertes mobiles.' },
        { icon: '🔐', title: 'Contrôle d\'accès', desc: 'Badges, biométrie, interphonie, gestion centralisée.' },
        { icon: '🔥', title: 'Clôtures électriques', desc: 'Protection périmétrique dissuasive et certifiée.' },
        { icon: '📞', title: 'Interphonie vidéo', desc: 'Interphones vidéo, ouverture à distance, multi-postes.' },
      ]}
      productCategories={['CCTV & Surveillance', 'Access Control', 'Electric Fence']}
      benefits={[
        'Intervention 24/7 en cas d\'urgence',
        'Installation conforme aux normes',
        'Monitoring à distance depuis votre smartphone',
        'Contrats de maintenance et supervision',
        'Matériel certifié (Hikvision, Dahua…)',
        'Formation utilisateur incluse',
      ]}
    />
  );
}