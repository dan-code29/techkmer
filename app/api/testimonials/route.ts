import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import nodemailer from 'nodemailer';

// Récupérer les avis
export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM testimonials ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Ajouter un avis + Notification Email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Insertion en base de données
    await turso.execute({
      sql: `INSERT INTO testimonials (name, role, text, rating, services) VALUES (?, ?, ?, ?, ?)`,
      args: [
        body.name, 
        body.role, 
        body.text, 
        body.rating || 5, 
        body.services ? body.services.join(', ') : ''
      ],
    });

    // 2. Notification par Email (avec son propre try/catch pour ne pas bloquer si l'email échoue)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"CHEFFBUILD Site" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `⭐ Nouvel avis client de ${body.name}`,
        html: `
          <h2>Nouvel avis publié sur le site !</h2>
          <p><strong>Nom :</strong> ${body.name}</p>
          <p><strong>Profil :</strong> ${body.role}</p>
          <p><strong>Note :</strong> ${'★'.repeat(body.rating || 5)}</p>
          <p><strong>Message :</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #0066FF;">${body.text}</blockquote>
          <br/>
          <a href="https://techkmer.vercel.app/admin/testimonials">Gérer les avis</a>
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On ne bloque pas l'enregistrement de l'avis si l'email échoue
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST testimonial:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}