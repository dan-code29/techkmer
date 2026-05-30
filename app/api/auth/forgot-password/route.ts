import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserByEmail, ensureUserResetColumns, setUserPasswordResetToken } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body?.email || '').trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }

  await ensureUserResetColumns();
  const user = await getUserByEmail(email);

  if (user) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    await setUserPasswordResetToken(user.id as number, token, expiresAt);
    await sendPasswordResetEmail(String(user.name || 'Utilisateur'), String(user.email), token);
  }

  return NextResponse.json({ message: 'Si l’adresse existe, un lien de réinitialisation a été envoyé.' });
}
