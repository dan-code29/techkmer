'use client';
import { useState, useEffect, useMemo } from 'react';
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
  salesCount: number;
  description: string;
  isPromotion: number;
  dateAdded?: string;
};

export default function BoutiquePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('default');
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

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['all', ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-seller':
        filtered = filtered.filter(p => p.salesCount > 50);
        break;
      default:
        break;
    }
    return filtered;
  }, [products, selectedCategory, sortOption]);

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

  if (loading) return <div className="text-center py-12">Chargement des produits...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Notre boutique</h1>
      {showAlert && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {lastProduct} ajouté au panier !
        </div>
      )}

      {/* Filtres et tri */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat === 'all' ? 'Tous les articles' : cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-700">Trier par :</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            <option value="default">Par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="best-seller">Meilleures ventes</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <Link href={`/produit/${product.id}`} className="relative h-48 block">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </Link>
            <div className="p-4">
              <Link href={`/produit/${product.id}`} className="hover:underline">
                <h2 className="text-xl font-semibold">{product.name}</h2>
              </Link>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">{formatPrice(product.price)}</p>
              {product.salesCount > 50 && (
                <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded mt-2">
                  Best-seller
                </span>
              )}
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
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">Aucun produit trouvé.</div>
      )}
    </div>
  );
}