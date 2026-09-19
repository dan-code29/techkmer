'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '@/context/WishlistContext';

// ============================================================================
//  TYPES
// ============================================================================
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

// ============================================================================
//  COMPOSANT : ProductWishlistButton
//  Bouton cœur pour ajouter/retirer un produit des favoris
//  Utilisé sur la page produit (Server Component)
// ============================================================================
export default function ProductWishlistButton({ product }: { product: Product }) {
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <button
      onClick={() => toggleItem(product)}
      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${
        wishlisted
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
      }`}
      aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <FaHeart size={16} />
    </button>
  );
}