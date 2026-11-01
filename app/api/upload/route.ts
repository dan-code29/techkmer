import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // 1. Vérification de l'authentification admin
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Vérification pour Vercel (sécurité)
    // Note: On bloque seulement si on est sur Vercel pour te permettre de tester en local
    if (process.env.VERCEL === '1') {
      return NextResponse.json(
        {
          error:
            'Upload impossible en production sur Vercel. Utilisez un service externe.',
        },
        { status: 500 }
      );
    }

    // 3. Récupération des fichiers (AU PLURIEL)
    const formData = await request.formData();
    const files = formData.getAll('files') as File[]; // On récupère TOUS les fichiers envoyés

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // 4. Boucle pour traiter chaque fichier
    for (const file of files) {
      // Vérification du type MIME
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Type de fichier non autorisé.' }, { status: 400 });
      }

      // Vérification de la taille (max 5 Mo)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'Le fichier dépasse 5 Mo.' }, { status: 400 });
      }

      // Génération du nom unique
      const timestamp = Date.now();
      // On nettoie le nom pour éviter les espaces
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
      const filename = `${timestamp}-${safeName}`;
      
      // On sauvegarde dans le dossier des réalisations
      const relativePath = `/images/projects/${filename}`;
      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      // Création du dossier si nécessaire (au cas où)
      await mkdir(path.dirname(absolutePath), { recursive: true });

      // Écriture du fichier sur le disque
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(absolutePath, buffer);

      // On ajoute l'URL à la liste
      uploadedUrls.push(relativePath);
    }

    // 5. On renvoie le tableau d'URLs (notre front-end attend "urls")
    return NextResponse.json({ urls: uploadedUrls });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l’upload' }, { status: 500 });
  }
}