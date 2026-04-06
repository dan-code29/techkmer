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
    const { name, price, image, category, salesCount, description, isPromotion } = body;

    if (!name || !price || !image || !category) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // Convertir isPromotion correctement (peut être boolean true/false ou 1/0)
    const isPromotionValue = isPromotion ? 1 : 0;
    console.log('📥 API PUT reçu isPromotion:', isPromotion, '(type:', typeof isPromotion, ') -> convertir en:', isPromotionValue);

    const result = await turso.execute({
      sql: `UPDATE products
            SET name = ?, price = ?, image = ?, category = ?, salesCount = ?, description = ?, isPromotion = ?
            WHERE id = ? RETURNING *`,
      args: [name, price, image, category, salesCount || 0, description || null, isPromotionValue, productId],
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