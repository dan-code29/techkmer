import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Insertion dans la base de données Turso
    const insertSQL = `
      INSERT INTO quotes (name, email, message)
      VALUES (?, ?, ?)
    `;
    await turso.execute({
      sql: insertSQL,
      args: [name, email, message],
    });

    // Envoi des emails (client + admin)
    await sendConfirmationEmail(name, email, message);

    return NextResponse.json(
      { message: 'Devis envoyé avec succès !' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors du traitement du devis:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}