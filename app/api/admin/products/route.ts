import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { turso } from '@/lib/turso';

// GET : récupérer tous les produits (admin)
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const result = await turso.execute('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('GET /api/admin/products error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, image, category, salesCount, description, isPromotion } = body;

    if (!name || !price || !image || !category) {
      return NextResponse.json({ error: 'Champs manquants (name, price, image, category)' }, { status: 400 });
    }

    // Convertir isPromotion correctement (peut être boolean true/false ou 1/0)
    const isPromotionValue = isPromotion ? 1 : 0;
    console.log('📥 API POST reçu isPromotion:', isPromotion, '(type:', typeof isPromotion, ') -> convertir en:', isPromotionValue);

    const dateAdded = new Date().toISOString().slice(0, 10);
    const result = await turso.execute({
      sql: `INSERT INTO products (name, price, image, category, salesCount, dateAdded, description, isPromotion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [name, price, image, category, salesCount || 0, dateAdded, description || null, isPromotionValue],
    });

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}