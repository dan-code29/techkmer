'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  isPromotion: number;
};

export default function PromotionCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const promoProducts = data.filter((p: Product) => p.isPromotion === 1);
        setProducts(promoProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % products.length);

  if (loading) return <div className="text-center py-8">Chargement des promotions...</div>;
  if (products.length === 0) return null;

  const current = products[currentIndex];
  const imageSrc = current.image && typeof current.image === 'string' ? current.image : '/images/placeholder.jpg';

  return (
    <div className="relative w-full bg-gradient-to-r from-red-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">🔥 Produits en promotion</h2>
        <div className="relative max-w-4xl mx-auto">
          <Link href={`/produit/${current.id}`} className="block">
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={current.name}
                fill
                className="object-contain bg-white"
                priority
              />
            </div>
          </Link>
          <div className="text-center mt-4">
            <Link href={`/produit/${current.id}`} className="hover:underline">
              <h3 className="text-xl font-semibold">{current.name}</h3>
            </Link>
            <p className="text-gray-600">{current.category}</p>
            <p className="text-2xl text-red-600 font-bold mt-1">{formatPrice(current.price)}</p>
            <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full mt-2">Promotion</span>
          </div>
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            ◀
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            ▶
          </button>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2 mb-4">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}