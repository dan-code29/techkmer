import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(name: string, email: string, message: string) {
  try {
    // Email de confirmation au client
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: 'Tech Innov\'Solutions <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmation de votre demande de devis - Tech Innov\'Solutions',
      html: `
        <h1>Bonjour ${name},</h1>
        <p>Nous avons bien reçu votre demande de devis. Voici un récapitulatif :</p>
        <p><strong>Message :</strong> ${message}</p>
        <p>Nous reviendrons vers vous dans les plus brefs délais.</p>
        <p>L'équipe Tech Innov'Solutions</p>
      `,
    });

    if (clientError) {
      console.error('Erreur Resend (client):', clientError);
    }

    // Email à l'administrateur
    const adminEmail = process.env.ADMIN_EMAIL || 'dancheffo29@gmail.com';
    const { error: adminError } = await resend.emails.send({
      from: 'Tech Innov\'Solutions <onboarding@resend.dev>',
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
/**
 * Envoyer email de confirmation de commande au client
 */
export async function sendOrderConfirmationEmail(
  name: string,
  email: string,
  orderId: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  totalPrice: number,
  deliveryDate: string,
  paymentMethod: 'delivery' | 'online'
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'dancheffo29@gmail.com';
    const appUrl = process.env.APP_URL || 'https://techinnovsolutions.com';

    const itemsHtml = items
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price.toLocaleString('fr-FR')} FCFA</td></tr>`
      )
      .join('');

    const paymentText = paymentMethod === 'delivery' ? 'Paiement à la livraison' : 'Paiement en ligne effectué';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">✅ Commande Confirmée</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Merci pour votre achat ! Votre commande a été confirmée.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Numéro de commande :</strong> #${orderId}</p>
            <p><strong>Date de commande :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            <p><strong>Date de livraison prévue :</strong> ${new Date(deliveryDate).toLocaleDateString('fr-FR')}</p>
          </div>

          <h3>Détail de votre commande :</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <thead>
              <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="padding: 10px; text-align: left;">Article</th>
                <th style="padding: 10px; text-align: center;">Quantité</th>
                <th style="padding: 10px; text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr style="border-top: 2px solid #d1d5db; font-weight: bold;">
                <td colspan="2" style="padding: 10px; text-align: right;">Total :</td>
                <td style="padding: 10px; text-align: right; color: #059669; font-size: 18px;">${totalPrice.toLocaleString('fr-FR')} FCFA</td>
              </tr>
            </tbody>
          </table>

          <p><strong>Mode de paiement :</strong> ${paymentText}</p>

          <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 3px;">
            <h4 style="margin-top: 0;">📋 Prochaines étapes :</h4>
            <ul style="margin-bottom: 0; padding-left: 20px;">
              <li>Nous vous contacterons au téléphone pour confirmer les détails de livraison</li>
              <li>Vous recevrez un SMS la veille de la livraison</li>
              <li>Un dernier SMS sera envoyé le jour de la livraison</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 14px;">
            Si vous avez des questions, n'hésitez pas à nous contacter ou répondre à cet email.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <strong>Tech Innov'Solutions</strong><br/>
            Solutions électriques et domotiques<br/>
            <a href="${appUrl}" style="color: #059669; text-decoration: none;">${appUrl}</a>
          </p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Tech Innov\'Solutions <onboarding@resend.dev>',
      to: [email],
      subject: `Commande confirmée - #${orderId}`,
      html,
    });

    if (error) {
      console.error('❌ Erreur envoi email commande client:', error);
      throw error;
    }

    console.log(`✅ Email de confirmation envoyé à ${email}`);
  } catch (error) {
    console.error('Erreur d\'envoi d\'email de commande:', error);
    throw error;
  }
}
export async function sendPasswordResetEmail(name: string, email: string, token: string) {
  try {
    const appUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl.replace(/\/$/, '')}/reset-password/${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Réinitialisation du mot de passe</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
          <p>Bonjour ${name},</p>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
          <p>Pour définir un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
          </p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé ce changement, vous pouvez ignorer ce message.</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            L'équipe Tech Innov'Solutions
          </p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Tech Innov\'Solutions <onboarding@resend.dev>',
      to: [email],
      subject: 'Réinitialisation de votre mot de passe - Tech Innov\'Solutions',
      html,
    });

    if (error) {
      console.error('Erreur Resend (mot de passe oublié):', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur d’envoi de l’email de réinitialisation:', error);
    throw error;
  }
}
/**
 * Envoyer email de notification admin pour nouvelle commande
 */
export async function sendOrderNotificationToAdmin(
  name: string,
  phone: string,
  address: string,
  orderId: number,
  totalPrice: number,
  paymentMethod: 'delivery' | 'online'
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'dancheffo29@gmail.com';
    const appUrl = process.env.APP_URL || 'https://techinnovsolutions.com';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">🛒 Nouvelle Commande</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <p><strong>Numéro de commande :</strong> #${orderId}</p>
          <p><strong>Client :</strong> ${name}</p>
          <p><strong>Téléphone :</strong> <a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a></p>
          <p><strong>Adresse :</strong> ${address}</p>
          <p><strong>Montant :</strong> ${totalPrice.toLocaleString('fr-FR')} FCFA</p>
          <p><strong>Mode de paiement :</strong> ${paymentMethod === 'delivery' ? 'À la livraison' : 'En ligne'}</p>
          
          <div style="margin-top: 20px;">
            <a href="${appUrl}/admin/commandes/${orderId}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block;">
              Voir la commande
            </a>
          </div>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Tech Innov\'Solutions <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `Nouvelle commande : #${orderId} - ${totalPrice.toLocaleString('fr-FR')} FCFA`,
      html,
    });

    if (error) {
      console.error('❌ Erreur envoi email admin:', error);
      throw error;
    }

    console.log(`✅ Email de notification admin envoyé`);
  } catch (error) {
    console.error('Erreur d\'envoi d\'email admin:', error);
    throw error;
  }
}