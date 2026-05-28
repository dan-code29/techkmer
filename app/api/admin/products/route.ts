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
    const { name, price, image, images, promoPrice, category, salesCount, description, isPromotion } = body;

    if (!name || !price || !image || !category) {
      return NextResponse.json({ error: 'Champs manquants (name, price, image, category)' }, { status: 400 });
    }

    // Convertir isPromotion correctement (peut être boolean true/false ou 1/0)
    const isPromotionValue = isPromotion ? 1 : 0;
    console.log('📥 API POST reçu isPromotion:', isPromotion, '(type:', typeof isPromotion, ') -> convertir en:', isPromotionValue);

    // vérifier si les colonnes 'images' et 'promoPrice' existent, sinon les ajouter
    try {
      const info = await turso.execute('PRAGMA table_info(products)');
      const cols = (info.rows || []).map((r: any) => r.name);
      if (!cols.includes('images')) {
        await turso.execute({ sql: 'ALTER TABLE products ADD COLUMN images TEXT' });
      }
      if (!cols.includes('promoPrice')) {
        await turso.execute({ sql: 'ALTER TABLE products ADD COLUMN promoPrice REAL' });
      }
    } catch (err) {
      console.warn('⚠️ Impossible de vérifier/ajouter colonnes (ignoré):', err);
    }

    const dateAdded = new Date().toISOString().slice(0, 10);

    const imagesJson = images ? JSON.stringify(images) : null;
    const imageToStore = image || (Array.isArray(images) && images.length > 0 ? images[0] : null);
    const promoPriceValue = promoPrice != null ? promoPrice : null;

    // Construire la requête dynamiquement pour rester compatible
    const cols = ['name', 'price', 'image', 'category', 'salesCount', 'dateAdded', 'description', 'isPromotion'];
    const placeholders = ['?', '?', '?', '?', '?', '?', '?', '?'];
    const args: any[] = [name, price, imageToStore, category, salesCount || 0, dateAdded, description || null, isPromotionValue];

    if (imagesJson !== null) {
      cols.push('images');
      placeholders.push('?');
      args.push(imagesJson);
    }
    if (promoPriceValue !== null) {
      cols.push('promoPrice');
      placeholders.push('?');
      args.push(promoPriceValue);
    }

    const sql = `INSERT INTO products (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const result = await turso.execute({ sql, args });

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}