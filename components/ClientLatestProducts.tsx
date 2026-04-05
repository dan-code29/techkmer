'use client';

import dynamic from 'next/dynamic';

// Chargement dynamique du composant LatestProducts (uniquement côté client)
const LatestProducts = dynamic(() => import('@/components/LatestProducts'), { ssr: false });

export default function ClientLatestProducts() {
  return <LatestProducts />;
}