import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupération du fichier
    const formData = await request.formData();
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
    }

    // Vérification du type MIME
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP.' },
        { status: 400 }
      );
    }

    // Vérification de la taille (max 5 Mo)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier dépasse la taille maximale autorisée (5 Mo).' },
        { status: 400 }
      );
    }

    // Génération du nom unique
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `${timestamp}${ext}`;
    const relativePath = `/images/produits/${filename}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    // Création du dossier si nécessaire
    await mkdir(path.dirname(absolutePath), { recursive: true });

    // Écriture du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(absolutePath, buffer);

    return NextResponse.json({ path: relativePath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l’upload' }, { status: 500 });
  }
}