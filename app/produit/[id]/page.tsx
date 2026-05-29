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

  // Conversion sécurisée des valeurs (Turso peut retourner null)
  const productName = product.name ? String(product.name) : 'Produit';
  const productCategory = product.category ? String(product.category) : '';
  // Convertir product.price en nombre (0 si null ou non numérique)
  const rawPrice = product.price;
  const productPrice = typeof rawPrice === 'number' ? rawPrice : (rawPrice ? Number(rawPrice) : 0);
  const productDescription = product.description ? String(product.description) : 'Aucune description disponible.';
  const imageSrc = product.image && typeof product.image === 'string' ? product.image : '/images/placeholder.jpg';

  const cartProduct = {
    id: product.id,
    name: productName,
    price: productPrice,
    image: imageSrc,
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-96">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{productName}</h1>
          <p className="text-gray-600 mb-4">{productCategory}</p>
          <p className="text-2xl text-blue-600 font-bold mb-6">{formatPrice(productPrice)}</p>
          <p className="text-gray-700 mb-6">{productDescription}</p>
          <AddToCartButton product={cartProduct} />
          <Link href="/boutique" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}