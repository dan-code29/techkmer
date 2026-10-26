import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    // Compter les réalisations (adapte le nom de la table à ta DB)
    const realisationsResult = await turso.execute(
      'SELECT COUNT(*) as count FROM realisations'
    );

    // Compter les régions distinctes (adapte aussi)
    const regionsResult = await turso.execute(
      'SELECT COUNT(DISTINCT region) as count FROM realisations'
    );

    const projectsCount = Number(realisationsResult.rows[0]?.count ?? 0);
    const regionsCount = Number(regionsResult.rows[0]?.count ?? 0);

    return NextResponse.json({
      projects: projectsCount || 50,   // fallback si table vide/absente
      regions: regionsCount || 10,
      responseTime: '24h',
      warranty: '12',
    });
  } catch (err) {
    console.error('Stats API error:', err);
    // Fallback : renvoie des valeurs par défaut plutôt qu'une erreur
    return NextResponse.json({
      projects: 50,
      regions: 10,
      responseTime: '24h',
      warranty: '12',
    });
  }
}