import { turso } from './turso';
import bcrypt from 'bcryptjs';

export async function getUserByEmail(email: string) {
  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  });
  return result.rows[0];
}

export async function ensureUserResetColumns() {
  const result = await turso.execute({
    sql: 'PRAGMA table_info(users)',
  });

  const columns = result.rows.map((row: any) => row.name);
  if (!columns.includes('passwordResetToken')) {
    await turso.execute({ sql: 'ALTER TABLE users ADD COLUMN passwordResetToken TEXT' });
  }
  if (!columns.includes('passwordResetExpires')) {
    await turso.execute({ sql: 'ALTER TABLE users ADD COLUMN passwordResetExpires TEXT' });
  }
}

export async function setUserPasswordResetToken(userId: number, token: string, expires: string) {
  await turso.execute({
    sql: 'UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE id = ?',
    args: [token, expires, userId],
  });
}

export async function getUserByResetToken(token: string) {
  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE passwordResetToken = ?',
    args: [token],
  });
  const user = result.rows[0];
  if (!user || !user.passwordResetExpires) {
    return null;
  }

  const expires = new Date(String(user.passwordResetExpires)).getTime();
  if (Number.isNaN(expires) || expires < Date.now()) {
    return null;
  }

  return user;
}

export async function updateUserPasswordById(userId: number, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await turso.execute({
    sql: 'UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = ?',
    args: [hashedPassword, userId],
  });
}

export async function createUser(name: string, email: string, password: string, role: string = 'client') {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await turso.execute({
    sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id, name, email, role',
    args: [name, email, hashedPassword, role],
  });
  return result.rows[0];
}