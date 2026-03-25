import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const password = authHeader?.split(' ')[1];

  // Vérification du mot de passe
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const result = await turso.execute('SELECT * FROM quotes ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur API admin:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}