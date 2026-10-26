import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'ID de commande invalide' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at DESC',
      args: [orderId],
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur tracking:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
