import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(name: string, email: string, message: string) {
  try {
    // Email de confirmation au client
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: 'Techkmer <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmation de votre demande de devis - Techkmer',
      html: `
        <h1>Bonjour ${name},</h1>
        <p>Nous avons bien reçu votre demande de devis. Voici un récapitulatif :</p>
        <p><strong>Message :</strong> ${message}</p>
        <p>Nous reviendrons vers vous dans les plus brefs délais.</p>
        <p>L'équipe Techkmer</p>
      `,
    });

    if (clientError) {
      console.error('Erreur Resend (client):', clientError);
    }

    // Email à l'administrateur
    const adminEmail = process.env.ADMIN_EMAIL || 'dancheffo29@gmail.com';
    const { error: adminError } = await resend.emails.send({
      from: 'Techkmer <onboarding@resend.dev>',
      to: [adminEmail],
      subject: 'Nouvelle demande de devis',
      html: `
        <h1>Nouveau devis de ${name}</h1>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
        <p>Connectez-vous à l’admin pour voir toutes les demandes.</p>
      `,
    });

    if (adminError) console.error('Erreur Resend (admin):', adminError);

  } catch (error) {
    console.error('Erreur d’envoi d’email:', error);
    throw error;
  }
}