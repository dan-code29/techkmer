'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  dateAdded: string;
  salesCount: number;
  isPromotion: number;
};

const ITEMS_PER_PAGE = 5;

export default function LatestProducts() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [lastProduct, setLastProduct] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Trier par dateAdded (du plus récent au plus ancien)
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );
  const latest20 = sortedProducts.slice(0, 20);
  const totalPages = Math.ceil(latest20.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = latest20.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setLastProduct(product.name);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  if (loading) return <div className="text-center py-12">Chargement des articles...</div>;
  if (products.length === 0) return null;

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Derniers articles</h2>
      {showAlert && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {lastProduct} ajouté au panier !
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
            <Link href={`/produit/${product.id}`} className="relative h-48 block">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/produit/${product.id}`} className="hover:underline">
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </Link>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">{formatPrice(product.price)}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1">Page {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
      <div className="text-center mt-8">
        <Link href="/boutique" className="text-blue-600 hover:underline">
          Voir tous les produits →
        </Link>
      </div>
    </section>
  );
}