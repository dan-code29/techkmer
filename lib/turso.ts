import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn('⚠️ TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN manquants — DB inaccessible');
}

export const turso = createClient({
  url: url ?? 'file::memory:',      // fallback en mémoire pour ne pas planter
  authToken: authToken ?? '',
});