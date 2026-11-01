import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Récupérer tous les projets
export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM projects ORDER BY date DESC');
    
    // On transforme les chaînes JSON en tableaux pour le frontend
    const projects = result.rows.map((row) => ({
      ...row,
      id: Number(row.id),
      images: JSON.parse(row.images as string || '[]'),
      features: JSON.parse(row.features as string || '[]'),
      shortDesc: row.short_desc, // On renomme pour correspondre à ton code existant
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Ajouter un nouveau projet
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await turso.execute({
      sql: `INSERT INTO projects 
            (title, category, date, year, location, client, images, short_desc, challenge, solution, result, features) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.title,
        body.category,
        body.date,
        body.year,
        body.location,
        body.client,
        JSON.stringify(body.images), // On convertit le tableau en texte JSON
        body.shortDesc,
        body.challenge,
        body.solution,
        body.result,
        JSON.stringify(body.features),
      ],
    });

    return NextResponse.json({ success: true, id: String(result.lastInsertRowid) });
  } catch (error) {
    console.error('Erreur POST project:', error);
    return NextResponse.json({ error: 'Erreur lors de l’ajout' }, { status: 500 });
  }
}