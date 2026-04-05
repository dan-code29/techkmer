import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    // Exécuter la requête pour récupérer tous les produits triés par ID décroissant
    const result = await turso.execute('SELECT * FROM products ORDER BY id DESC');
    // Retourner les données au format JSON
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur dans /api/products:', error);
    // En cas d'erreur, retourner un message d'erreur avec un statut 500
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}