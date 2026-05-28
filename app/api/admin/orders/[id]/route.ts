import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { turso } from '@/lib/turso';
import { sendPaymentConfirmationSMS } from '@/lib/sms';

// PATCH : mettre à jour le statut d'une commande
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token && token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Statut requis' }, { status: 400 });
    }

    // Mettre à jour le statut
    const result = await turso.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ? RETURNING *',
      args: [status, orderId],
    });

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    const order = result.rows[0];

    // Envoyer SMS de notification si en cours de livraison
    if (status === 'processing') {
      try {
        await sendPaymentConfirmationSMS(order.phone, orderId, order.totalPrice);
      } catch (err) {
        console.error('❌ Erreur SMS notification:', err);
      }
    }

    console.log(`✅ Statut commande #${orderId} changé en: ${status}`);

    return NextResponse.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE : supprimer une commande
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token && token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);

    const result = await turso.execute({
      sql: 'DELETE FROM orders WHERE id = ? RETURNING id',
      args: [orderId],
    });

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    console.log(`✅ Commande #${orderId} supprimée`);

    return NextResponse.json({ message: 'Commande supprimée' });
  } catch (error) {
    console.error('❌ Erreur suppression commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
