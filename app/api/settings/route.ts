import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Lire les paramètres
export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM settings');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lecture settings' }, { status: 500 });
  }
}

// Modifier les paramètres
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // On reçoit un tableau d'objets { key, value, label }
    
    for (const item of body) {
      await turso.execute({
        sql: 'UPDATE settings SET value = ?, label = ? WHERE key = ?',
        args: [item.value, item.label, item.key]
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur modification settings' }, { status: 500 });
  }
}