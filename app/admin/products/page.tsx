'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  salesCount: number;
  description: string;
  isPromotion: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error(`❌ HTTP ${res.status}:`, errorData);
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log('✅ Produits chargés:', data);
      setProducts(data);
    } catch (err: any) {
      console.error('❌ Erreur fetch complète:', err);
      setError(err.message || 'Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Erreur suppression' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      fetchProducts(); // recharge la liste
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">Erreur : {error}</div>;

  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <Link href="/admin/products/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nouveau produit
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Prix</th>
              <th className="p-2 border">Ventes</th>
              <th className="p-2 border">Promo</th>
              <th className="p-2 border">Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-center">{product.id}</td>
                <td className="p-2 text-center">
                  {isValidImageUrl(product.image) ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                      unoptimized={product.image.startsWith('http')}
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                      No img
                    </div>
                  )}
                </td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">{formatPrice(product.price)}</td>
                <td className="p-2 text-center">{product.salesCount}</td>
                <td className="p-2 text-center">
                    {product.isPromotion === 1 ? '✅' : '❌'}</td>
                <td className="p-2 text-center space-x-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline">
                    Modifier
                  </Link>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:underline ml-2">
                    Supprimer
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}