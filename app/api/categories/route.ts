import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
  try {
    const result = await turso.execute(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = result.rows.map(row => row.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    // En cas d'erreur, retourner un tableau vide plutôt qu'une erreur 500
    // pour ne pas bloquer l'affichage du formulaire.
    return NextResponse.json([]);
  }
}