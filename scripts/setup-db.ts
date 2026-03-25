import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@libsql/client';

// Force le chargement du fichier .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setup() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Variables d’environnement manquantes.');
    console.error('TURSO_DATABASE_URL =', url);
    console.error('TURSO_AUTH_TOKEN =', authToken ? 'défini' : 'manquant');
    process.exit(1);
  }

  console.log('✅ Variables chargées, création du client Turso...');

  const turso = createClient({ url, authToken });

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await turso.execute(createTableSQL);
    console.log('✅ Table "quotes" créée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table :', error);
  }
}

setup();