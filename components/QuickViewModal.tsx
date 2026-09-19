'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/format';
import {
  FaTimes, FaHeart, FaBolt, FaStar, FaCheckCircle,
  FaTruck, FaShieldAlt, FaArrowRight, FaMinus, FaPlus,
  FaHeadset, FaUndo, FaBoxOpen,
} from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  salesCount: number;
  isPromotion: number;
  description?: string;
};

// ============================================================================
//  COMPOSANT : QuickViewModal
//  Modal d'aperçu produit rapide
//
//  Fonctionnalités :
//    - Affichage image + infos produit
//    - Sélecteur de quantité
//    - Bouton "Ajouter au panier" avec feedback visuel
//    - Bouton "Ajouter aux favoris"
//    - Avantages (garantie, livraison, SAV)
//    - Lien vers la fiche complète
//    - Fermeture au clic extérieur ou sur Échap
// ============================================================================
export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ---------------------------------------------------------------------------
  //  Réinitialiser l'état quand le produit change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  // ---------------------------------------------------------------------------
  //  Fermer avec la touche Échap
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ---------------------------------------------------------------------------
  //  Bloquer le scroll du body quand le modal est ouvert
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Si aucun produit, ne rien afficher
  if (!product) return null;

  // ---------------------------------------------------------------------------
  //  Variables calculées
  // ---------------------------------------------------------------------------
  const imageSrc =
    product.image && typeof product.image === 'string'
      ? product.image
      : '/images/placeholder.jpg';

  const isPromo = product.isPromotion === 1;
  const discount = isPromo ? 20 : 0;
  const oldPrice = isPromo ? Math.round(product.price / 0.8) : 0;
  const wishlisted = isWishlisted(product.id);

  // ---------------------------------------------------------------------------
  //  Ajout au panier avec quantité
  // ---------------------------------------------------------------------------
  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageSrc,
      });
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  // ---------------------------------------------------------------------------
  //  Toggle favori
  // ---------------------------------------------------------------------------
  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageSrc,
      category: product.category,
    });
  };

  // ---------------------------------------------------------------------------
  //  Incrémenter / décrémenter la quantité
  // ---------------------------------------------------------------------------
  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================================
            BOUTON FERMER
        ================================================================== */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center z-10 text-gray-600 hover:text-gray-900 transition"
          aria-label="Fermer"
        >
          <FaTimes size={16} />
        </button>

        {/* ==================================================================
            CONTENU : 2 colonnes (image + infos)
        ================================================================== */}
        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">

          {/* =============================================================
              COLONNE GAUCHE : IMAGE
          ============================================================= */}
          <div className="relative">
            <div className="relative h-72 md:h-96 bg-gray-50 rounded-xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-contain p-6"
                priority
              />

              {/* Badge promo */}
              {isPromo && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                  -{discount}%
                </span>
              )}

              {/* Badge TOP */}
              {product.salesCount > 50 && (
                <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                  🔥 TOP
                </span>
              )}
            </div>

            {/* Mini galerie ou badges sous l'image */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <FaShieldAlt className="text-emerald-600 mx-auto mb-1" size={14} />
                <p className="text-[10px] text-gray-600 font-semibold">Garantie 12 mois</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <FaTruck className="text-emerald-600 mx-auto mb-1" size={14} />
                <p className="text-[10px] text-gray-600 font-semibold">Livraison rapide</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <FaUndo className="text-emerald-600 mx-auto mb-1" size={14} />
                <p className="text-[10px] text-gray-600 font-semibold">Retour 7j</p>
              </div>
            </div>
          </div>

          {/* =============================================================
              COLONNE DROITE : INFORMATIONS
          ============================================================= */}
          <div className="flex flex-col">

            {/* Catégorie */}
            <p className="text-[10px] text-[#00C2FF] font-bold uppercase tracking-widest mb-2">
              {product.category}
            </p>

            {/* Titre */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#050B16] mb-3 leading-tight">
              {product.name}
            </h2>

            {/* Étoiles */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} size={14} className="text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({Math.round(product.salesCount / 10)} avis)
              </span>
              <span className="text-xs text-emerald-600 font-semibold ml-auto">
                <FaCheckCircle size={10} className="inline mr-1" />
                En stock
              </span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-100">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>
              {isPromo && (
                <span className="text-gray-400 line-through text-lg">
                  {formatPrice(oldPrice)}
                </span>
              )}
              {isPromo && (
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
                  Économisez {formatPrice(oldPrice - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description ? (
              <p className="text-sm text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                {product.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic mb-4">
                Aucune description disponible pour ce produit.
              </p>
            )}

            {/* Avantages */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                <span>Produit original et certifié</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                <span>Assistance technique après-vente</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                <span>Paiement à la livraison disponible</span>
              </div>
            </div>

            {/* =============================================================
                QUANTITÉ + WISHLIST
            ============================================================= */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Quantité
              </span>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="w-10 h-10 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center"
                  aria-label="Diminuer"
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-12 text-center font-bold text-[#050B16]">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  className="w-10 h-10 text-gray-600 hover:bg-gray-50 transition flex items-center justify-center"
                  aria-label="Augmenter"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              <button
                onClick={handleWishlist}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${
                  wishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                }`}
                aria-label="Ajouter aux favoris"
              >
                <FaHeart size={14} />
              </button>
            </div>

            {/* =============================================================
                BOUTONS D'ACTION
            ============================================================= */}
            <div className="mt-auto space-y-3">

              {/* Bouton Ajouter au panier */}
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg ${
                  added
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <FaCheckCircle /> Ajouté au panier ({quantity})
                  </>
                ) : (
                  <>
                    <FaBolt size={12} /> Ajouter au panier
                  </>
                )}
              </button>

              {/* Bouton Voir la fiche complète */}
              <Link
                href={`/produit/${product.id}`}
                className="w-full border-2 border-[#050B16] text-[#050B16] font-semibold py-3 rounded-lg hover:bg-[#050B16] hover:text-white transition flex items-center justify-center gap-2 text-sm"
              >
                Voir la fiche complète <FaArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================
            PIED DU MODAL : réassurance
        ================================================================== */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 md:px-8 py-4 rounded-b-2xl">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <FaShieldAlt className="text-emerald-600" size={12} />
              Paiement sécurisé
            </span>
            <span className="flex items-center gap-2">
              <FaTruck className="text-emerald-600" size={12} />
              Livraison Douala & Yaoundé
            </span>
            <span className="flex items-center gap-2">
              <FaHeadset className="text-emerald-600" size={12} />
              Support 24/7
            </span>
            <span className="flex items-center gap-2">
              <FaBoxOpen className="text-emerald-600" size={12} />
              Produit original
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}