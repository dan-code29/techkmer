'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowRight, FaShoppingCart, FaChevronLeft, FaChevronRight, FaCheckCircle 
} from 'react-icons/fa';

type DBProduct = {
  id: number | string;
  name: string;
  category?: string;
  price: number | string;
  old_price?: number | string;
  image?: string;
  image_url?: string;
  badge?: string;
  in_stock?: boolean | number;
};

type Props = {
  products: DBProduct[];
};

const formatPrice = (price: number | string | undefined) => {
  if (!price) return '—';
  const numPrice = Number(price);
  if (isNaN(numPrice)) return String(price);
  return `${numPrice.toLocaleString('fr-FR')} FCFA`;
};

export default function HomeBoutique({ products }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour faire défiler le carrousel
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative z-10 py-20 overflow-hidden bg-gray-50/50">
      <div className="container mx-auto px-4">
        
        {/* ============ EN-TÊTE ============ */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#0066FF]">
            Shop our products
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Équipements professionnels
          </h2>
          <p className="max-w-2xl text-gray-600">
            Les produits que nous installons, disponibles dans notre boutique en ligne.
          </p>
        </div>

        {/* ============ CARROUSEL OU MESSAGE VIDE ============ */}
        {!products || products.length === 0 ? (
          <div className="py-10 text-center text-gray-500 bg-white/50 rounded-2xl border border-gray-200">
            <p>Aucun produit n'est disponible pour le moment.</p>
            <p className="text-sm mt-2">(Vérifie ta base de données ou le terminal pour voir s'il y a une erreur)</p>
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Flèche Gauche */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-xl transition hover:bg-[#0066FF] hover:text-white md:-left-4 opacity-0 group-hover/carousel:opacity-100"
            >
              <FaChevronLeft size={16} />
            </button>

            {/* Flèche Droite */}
            <button
              onClick={() => scroll('right')}
              className="absolute -right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066FF] shadow-xl transition hover:bg-[#0066FF] hover:text-white md:-right-4 opacity-0 group-hover/carousel:opacity-100"
            >
              <FaChevronRight size={16} />
            </button>

            {/* Conteneur des produits */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar"
            >
              {products.map((product) => {
                const imgSrc = product.image || product.image_url || 'https://placehold.co/400x400?text=Produit';
                const isInStock = product.in_stock !== false && product.in_stock !== 0;

                return (
                  <Link
                    key={product.id}
                    href={`/produit/${product.id}`}
                    className="group w-[260px] shrink-0 snap-start flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0066FF]/10"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        sizes="260px"
                        className="object-contain p-4 transition duration-500 group-hover:scale-110"
                      />
                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-md">
                          {product.badge}
                        </span>
                      )}
                      {isInStock && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-emerald-600 shadow-sm backdrop-blur-sm">
                          <FaCheckCircle size={10} /> En stock
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                        {product.category || 'Produit'}
                      </span>
                      <h3 className="mb-2 flex-1 text-sm font-bold text-gray-900 group-hover:text-[#0066FF]">
                        {product.name}
                      </h3>
                      
                      <div className="mt-2 flex items-end justify-between border-t border-gray-100 pt-3">
                        <div>
                          <div className="text-lg font-bold text-emerald-600">
                            {formatPrice(product.price)}
                          </div>
                          {product.old_price && Number(product.old_price) > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(product.old_price)}
                            </div>
                          )}
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF] transition group-hover:bg-[#0066FF] group-hover:text-white">
                          <FaShoppingCart size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ============ BOUTON VOIR TOUTE LA BOUTIQUE ============ */}
        <div className="mt-12 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0066FF] bg-white px-8 py-3 font-bold text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
          >
            Voir tous nos produits
            <FaArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}