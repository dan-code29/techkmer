import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '@/lib/email';
import { sendOrderSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, totalPrice, name, email, phone, address, deliveryDate, paymentMethod } = body;

    // Validations basiques
    if (!name || !email || !phone || !address || !deliveryDate) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier si la table orders existe, sinon la créer
    try {
      const info = await turso.execute('PRAGMA table_info(orders)');
      if (!info.rows || info.rows.length === 0) {
        await turso.execute({
          sql: `CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            deliveryDate TEXT NOT NULL,
            paymentMethod TEXT NOT NULL,
            items TEXT NOT NULL,
            totalPrice REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
        });
      }
    } catch (err) {
      console.warn('⚠️ Impossible de vérifier/créer la table orders (ignoré):', err);
    }

    // Sauvegarder la commande
    const result = await turso.execute({
      sql: `INSERT INTO orders (name, email, phone, address, deliveryDate, paymentMethod, items, totalPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id, created_at`,
      args: [
        name,
        email,
        phone,
        address,
        deliveryDate,
        paymentMethod,
        JSON.stringify(items),
        totalPrice,
      ],
    });

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
    }

    const order = result.rows[0];
    const orderId = order.id;

    // Log
    console.log('✅ Commande créée:', {
      id: orderId,
      name,
      email,
      phone,
      paymentMethod,
      totalPrice,
      createdAt: order.created_at,
    });

    // Envoyer email de confirmation au client
    try {
      await sendOrderConfirmationEmail(name, email, orderId, items, totalPrice, deliveryDate, paymentMethod);
    } catch (err) {
      console.error('❌ Erreur envoi email client:', err);
      // Ne pas bloquer la réponse si l'email échoue
    }

    // Envoyer notification à l'admin
    try {
      await sendOrderNotificationToAdmin(name, phone, address, orderId, totalPrice, paymentMethod);
    } catch (err) {
      console.error('❌ Erreur envoi email admin:', err);
    }

    // Envoyer SMS de confirmation
    try {
      await sendOrderSMS(phone, orderId, deliveryDate);
    } catch (err) {
      console.error('❌ Erreur envoi SMS:', err);
    }

    return NextResponse.json(
      {
        id: orderId,
        message: 'Commande créée avec succès. Confirmations envoyées par email et SMS.',
        status: 'pending',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET : récupérer une commande par ID (optionnel, pour futur usage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'ID de commande manquant' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [parseInt(orderId)],
    });

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    const order = result.rows[0];
    // Parser les items JSON
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

    return NextResponse.json({ ...order, items });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
