import { turso } from './turso';
import bcrypt from 'bcryptjs';

export async function getUserByEmail(email: string) {
  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  });
  return result.rows[0];
}

export async function createUser(name: string, email: string, password: string, role: string = 'client') {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await turso.execute({
    sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id, name, email, role',
    args: [name, email, hashedPassword, role],
  });
  return result.rows[0];
}