import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { turso } from '@/lib/turso';

// GET : récupérer toutes les commandes
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Vérifier l'authentification admin (optionnel si formulaire simple)
    if (token && token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const result = await turso.execute('SELECT * FROM orders ORDER BY created_at DESC');
    
    const orders = (result.rows || []).map((order: any) => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Erreur récupération commandes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
