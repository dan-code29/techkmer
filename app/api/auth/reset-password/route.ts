import { NextRequest, NextResponse } from 'next/server';
import { ensureUserResetColumns, getUserByResetToken, updateUserPasswordById } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = String(body?.token || '');
  const password = String(body?.password || '');

  if (!token || !password) {
    return NextResponse.json({ error: 'Token et mot de passe requis' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
  }

  await ensureUserResetColumns();
  const user = await getUserByResetToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Le lien de réinitialisation est invalide ou expiré.' }, { status: 400 });
  }

  await updateUserPasswordById(user.id as number, password);
  return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' });
}
