import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { turso } from '@/lib/turso';

// GET : récupérer un produit par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }
    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [productId],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT : modifier un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json();
    const { name, price, image, images, promoPrice, category, salesCount, description, isPromotion } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // Convertir isPromotion correctement (peut être boolean true/false ou 1/0)
    const isPromotionValue = isPromotion ? 1 : 0;
    console.log('📥 API PUT reçu isPromotion:', isPromotion, '(type:', typeof isPromotion, ') -> convertir en:', isPromotionValue);

    // vérifier et ajouter colonnes si nécessaire
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

    const imagesJson = images ? JSON.stringify(images) : null;
    const imageToStore = image || (Array.isArray(images) && images.length > 0 ? images[0] : null);
    const promoPriceValue = promoPrice != null ? promoPrice : null;

    // Construire la requête UPDATE dynamiquement
    const sets = ['name = ?', 'price = ?', 'image = ?', 'category = ?', 'salesCount = ?', 'description = ?', 'isPromotion = ?'];
    const args: any[] = [name, price, imageToStore, category, salesCount || 0, description || null, isPromotionValue];

    if (imagesJson !== null) {
      sets.push('images = ?');
      args.push(imagesJson);
    }
    if (promoPriceValue !== null) {
      sets.push('promoPrice = ?');
      args.push(promoPriceValue);
    }

    args.push(productId);

    const sql = `UPDATE products SET ${sets.join(', ')} WHERE id = ? RETURNING *`;
    const result = await turso.execute({ sql, args });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE : supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const result = await turso.execute({
      sql: 'DELETE FROM products WHERE id = ? RETURNING id',
      args: [productId],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}