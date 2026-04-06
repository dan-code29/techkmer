import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { turso } from '@/lib/turso';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(id: number) {
  const result = await turso.execute({
    sql: 'SELECT * FROM products WHERE id = ?',
    args: [id],
  });
  return result.rows[0];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(parseInt(id));
  if (!product) return { title: 'Produit non trouvé' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(parseInt(id));
  if (!product) return notFound();

  // Extraire les propriétés nécessaires pour le composant client
  const cartProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-96">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl text-blue-600 font-bold mb-6">{formatPrice(product.price)}</p>
          <p className="text-gray-700 mb-6">{product.description || 'Aucune description disponible.'}</p>
          {/* Passage d'un objet simple au composant client */}
          <AddToCartButton product={cartProduct} />
          <Link href="/boutique" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}