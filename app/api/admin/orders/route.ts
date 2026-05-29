import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { turso } from '@/lib/turso';

const verifyAdminAccess = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const adminPassword = authHeader?.split(' ')[1];
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (token?.role === 'admin' || adminPassword === process.env.ADMIN_PASSWORD) {
    return true;
  }

  return false;
};

// GET : récupérer toutes les commandes
export async function GET(request: NextRequest) {
  try {
    const hasAccess = await verifyAdminAccess(request);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Assurer l'existence de la table orders avant la sélection
    try {
      const info = await turso.execute('PRAGMA table_info(orders)');
      if (!info.rows || info.rows.length === 0) {
        await turso.execute({
          sql: `CREATE TABLE IF NOT EXISTS orders (
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
      console.warn('⚠️ Impossible de vérifier/créer la table orders dans l’API admin (ignoré):', err);
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
