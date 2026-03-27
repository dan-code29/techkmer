import dotenv from 'dotenv';
import path from 'path';

// Charger .env.local AVANT tout import dépendant des variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  // Importer dynamiquement lib/db après que les variables soient chargées
  const { createUser } = await import('../lib/db');

  const email = 'dancheffo29@gmail.com';
  const password = 'danchef@29';
  const name = 'Admin';

  try {
    const user = await createUser(name, email, password, 'admin');
    console.log('✅ Admin créé:', user);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

run();