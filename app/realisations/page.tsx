import type { Metadata } from 'next';
import Realisations from '@/components/Realisations';

export const metadata: Metadata = {
  title: 'Nos réalisations — WISE BUILD Smart Systems',
  description:
    'Découvrez nos projets d’installation en électricité, solaire, réseau, sécurité, domotique et automatisation à travers le Cameroun.',
};

export default function RealisationsPage() {
  return <Realisations />;
}