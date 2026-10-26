import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const SUBJECT_LABELS: Record<string, string> = {
  devis: 'Demande de devis',
  care: 'CHEFFBUILD CARE (maintenance)',
  boutique: 'Commande / Boutique',
  partenariat: 'Partenariat',
  autre: 'Autre',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // --- Validation ---
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    // --- Transporter (Gmail SMTP) ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password Gmail
      },
    });

    const subjectLabel = SUBJECT_LABELS[subject] || 'Contact';

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066FF;">Nouveau message — CHEFFBUILD</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Nom</td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Téléphone</td><td style="padding: 8px;">${phone || '—'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Sujet</td><td style="padding: 8px;">${subjectLabel}</td></tr>
        </table>
        <h3 style="color: #050B16; margin-top: 24px;">Message</h3>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #888; font-size: 12px;">Envoyé depuis cheffbuild.com — ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CHEFFBUILD Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[CHEFFBUILD] ${subjectLabel} — ${name}`,
      html,
    });

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Erreur serveur. Réessayez ou contactez-nous par WhatsApp.' },
      { status: 500 }
    );
  }
}