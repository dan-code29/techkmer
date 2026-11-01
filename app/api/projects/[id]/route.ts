import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Récupérer UN projet (pour le formulaire d'édition)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await turso.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  
  if (result.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
  
  const raw = result.rows[0];
  return NextResponse.json({
    ...raw,
    id: Number(raw.id),
    images: JSON.parse(raw.images as string || '[]'),
    features: JSON.parse(raw.features as string || '[]'),
    shortDesc: raw.short_desc, // On renvoie le bon nom pour le front
    status: raw.status || 'termine'
  });
}

// Mettre à jour un projet
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    await turso.execute({
      sql: `UPDATE projects SET 
            title = ?, category = ?, status = ?, date = ?, year = ?, 
            location = ?, client = ?, images = ?, short_desc = ?, 
            challenge = ?, solution = ?, result = ?, features = ?
            WHERE id = ?`,
      args: [
        body.title, body.category, body.status, body.date, body.year,
        body.location, body.client, JSON.stringify(body.images), body.shortDesc,
        body.challenge, body.solution, body.result, JSON.stringify(body.features),
        id
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur PUT:', error);
    return NextResponse.json({ error: 'Erreur modification' }, { status: 500 });
  }
}

// Supprimer un projet
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await turso.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
  return NextResponse.json({ success: true });
}