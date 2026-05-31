import dotenv from 'dotenv';
import path from 'path';

// Charger .env.local AVANT tout import dépendant des variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  // Importer dynamiquement lib/db après que les variables soient chargées
  const { createUser, getUserByEmail } = await import('../lib/db');

  const email = process.env.ADMIN_EMAIL || 'dancheffo29@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'danchef@29';
  const name = process.env.ADMIN_NAME || 'Admin';

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      console.log('ℹ️ Utilisateur admin déjà présent, opération ignorée:', email);
      return;
    }

    const user = await createUser(name, email, password, 'admin');
    console.log('✅ Admin créé:', user);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin :', error);
    process.exit(1);
  }
}

run();