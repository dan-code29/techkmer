// Librairie SMS - Support Orange Money, MTN Mobile Money
// À configurer avec Twilio, Vonage, ou autre service SMS

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_PROVIDER = process.env.SMS_PROVIDER || 'mock'; // 'twilio', 'vonage', 'mock'

/**
 * Envoyer un SMS de confirmation de commande
 */
export async function sendOrderSMS(phone: string, orderId: number, deliveryDate: string) {
  if (!phone) return;

  const message = `Techkmer: Commande #${orderId} confirmée. Livraison prévue le ${new Date(deliveryDate).toLocaleDateString('fr-FR')}. Nous vous appellerons pour confirmer.`;

  try {
    if (SMS_PROVIDER === 'twilio') {
      return await sendViaTwilio(phone, message);
    } else if (SMS_PROVIDER === 'vonage') {
      return await sendViaVonage(phone, message);
    } else {
      // Mode mock/simulation
      console.log(`📱 [SMS MOCK] → ${phone}: ${message}`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error('❌ Erreur envoi SMS:', err);
    throw err;
  }
}

/**
 * Envoyer un SMS de paiement confirmé
 */
export async function sendPaymentConfirmationSMS(phone: string, orderId: number, amount: number) {
  if (!phone) return;

  const message = `Techkmer: Paiement de ${amount} FCFA confirmé pour commande #${orderId}. Merci!`;

  try {
    if (SMS_PROVIDER === 'twilio') {
      return await sendViaTwilio(phone, message);
    } else if (SMS_PROVIDER === 'vonage') {
      return await sendViaVonage(phone, message);
    } else {
      console.log(`📱 [SMS MOCK] → ${phone}: ${message}`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error('❌ Erreur envoi SMS paiement:', err);
    throw err;
  }
}

/**
 * Envoyer un SMS de notification de livraison
 */
export async function sendDeliveryNotificationSMS(phone: string, orderId: number) {
  if (!phone) return;

  const message = `Techkmer: Votre commande #${orderId} sera livrée aujourd'hui. Assurez-vous d'être disponible.`;

  try {
    if (SMS_PROVIDER === 'twilio') {
      return await sendViaTwilio(phone, message);
    } else if (SMS_PROVIDER === 'vonage') {
      return await sendViaVonage(phone, message);
    } else {
      console.log(`📱 [SMS MOCK] → ${phone}: ${message}`);
      return { success: true, mock: true };
    }
  } catch (err) {
    console.error('❌ Erreur envoi SMS livraison:', err);
    throw err;
  }
}

// ============= Implémentations par provider =============

async function sendViaTwilio(phone: string, message: string) {
  // Exemple avec Twilio (à configurer si utilisé)
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!twilioAccountSid || !twilioAuthToken) {
    throw new Error('Twilio credentials manquants');
  }

  const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

  const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json'.replace('{AccountSid}', twilioAccountSid), {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: twilioPhoneNumber || '+1234567890',
      To: phone,
      Body: message,
    }).toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Twilio error: ${data.message}`);
  }

  console.log(`✅ SMS envoyé via Twilio: ${phone}`);
  return { success: true, provider: 'twilio', sid: data.sid };
}

async function sendViaVonage(phone: string, message: string) {
  // Exemple avec Vonage/Nexmo (à configurer si utilisé)
  const vonageApiKey = process.env.VONAGE_API_KEY;
  const vonageApiSecret = process.env.VONAGE_API_SECRET;

  if (!vonageApiKey || !vonageApiSecret) {
    throw new Error('Vonage credentials manquants');
  }

  const response = await fetch('https://rest.nexmo.com/sms/json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      api_key: vonageApiKey,
      api_secret: vonageApiSecret,
      to: phone,
      from: 'Techkmer',
      text: message,
    }).toString(),
  });

  const data = await response.json();
  if (data.messages?.[0]?.status !== '0') {
    throw new Error(`Vonage error: ${data.messages?.[0]?.error_text}`);
  }

  console.log(`✅ SMS envoyé via Vonage: ${phone}`);
  return { success: true, provider: 'vonage', messageId: data.messages[0].message_id };
}
