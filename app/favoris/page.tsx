'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import {
  FaHeart, FaTrash, FaBolt, FaArrowLeft, FaCheckCircle,
  FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaUndo,
  FaEye, FaTimes,
} from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

// ============================================================================
//  PAGE FAVORIS
// ============================================================================
export default function FavorisPage() {
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();

  // Feedback visuel après ajout au panier
  const [addedId, setAddedId] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ---------------------------------------------------------------------------
  //  Ajouter un favori au panier
  // ---------------------------------------------------------------------------
  const handleAddToCart = (product: WishlistItem) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // ---------------------------------------------------------------------------
  //  Ajouter tous les favoris au panier
  // ---------------------------------------------------------------------------
  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    });
  };

  // ===========================================================================
  //  ÉTAT VIDE : aucun favori
  // ===========================================================================
  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          {/* Icône cœur vide */}
          <div className="w-24 h-24 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6 relative">
            <FaHeart size={36} className="text-red-200" />
            <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
              0
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#050B16] mb-3">
            Votre liste de favoris est vide
          </h1>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Ajoutez des produits à vos favoris en cliquant sur le cœur
            <FaHeart size={11} className="inline mx-1 text-red-400" />
            sur les fiches produits ou dans la boutique.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              <FaArrowLeft size={12} /> Explorer la boutique
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#050B16] text-[#050B16] font-semibold px-6 py-3 rounded-lg hover:bg-[#050B16] hover:text-white transition"
            >
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Suggestions rapides */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Catégories populaires
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { href: '/boutique?cat=Electrical', label: '⚡ Électricité' },
                { href: '/boutique?cat=CCTV%20%26%20Surveillance', label: '📹 Sécurité' },
                { href: '/boutique?cat=Smart%20Home', label: '🏠 Domotique' },
                { href: '/boutique?cat=Networking', label: '🌐 Réseau' },
              ].map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  //  ÉTAT AVEC FAVORIS
  // ===========================================================================
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">

        {/* ==================================================================
            EN-TÊTE
        ================================================================== */}
        <div className="mb-8">
          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-emerald-600 transition">Accueil</Link>
            <span>›</span>
            <span className="text-[#050B16] font-semibold">Mes favoris</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#050B16] flex items-center gap-3">
                <FaHeart className="text-red-500" size={26} />
                Mes favoris
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalItems} produit{totalItems > 1 ? 's' : ''} dans votre liste
              </p>
            </div>

            {/* Actions globales */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Ajouter tout au panier */}
              <button
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-md"
              >
                <FaShoppingCart size={12} /> Tout ajouter au panier
              </button>

              {/* Vider la liste */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
              >
                <FaTrash size={11} /> Tout effacer
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================
            BANDEAU RÉASSURANCE
        ================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: FaTruck, label: 'Livraison rapide', sub: 'Douala & Yaoundé' },
            { icon: FaShieldAlt, label: 'Garantie 12 mois', sub: 'Produits certifiés' },
            { icon: FaUndo, label: 'Retour 7 jours', sub: 'Sans justification' },
            { icon: FaBolt, label: 'Paiement livraison', sub: 'Cash ou Mobile' },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#050B16] truncate">{badge.label}</p>
                  <p className="text-[10px] text-gray-500 truncate">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================================
            GRILLE DES FAVORIS
        ================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => {
            const imageSrc =
              item.image && typeof item.image === 'string'
                ? item.image
                : '/images/placeholder.jpg';

            const isAdded = addedId === item.id;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col relative"
              >
                {/* ============================================================
                    BOUTON SUPPRIMER (croix rouge flottante)
                ============================================================ */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-red-50 shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                  aria-label="Retirer des favoris"
                  title="Retirer des favoris"
                >
                  <FaTimes size={11} />
                </button>

                {/* ============================================================
                    BADGE FAVORI (cœur)
                ============================================================ */}
                <span className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center">
                  <FaHeart size={12} />
                </span>

                {/* ============================================================
                    IMAGE (cliquable)
                ============================================================ */}
                <Link
                  href={`/produit/${item.id}`}
                  className="relative h-40 bg-gray-50 block"
                >
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition duration-300"
                  />
                </Link>

                {/* ============================================================
                    CONTENU
                ============================================================ */}
                <div className="p-3 flex flex-col flex-1">
                  {/* Catégorie */}
                  {item.category && (
                    <p className="text-[9px] text-[#00C2FF] font-bold uppercase tracking-widest mb-1 truncate">
                      {item.category}
                    </p>
                  )}

                  {/* Nom (cliquable) */}
                  <Link href={`/produit/${item.id}`}>
                    <h3 className="text-sm font-semibold text-[#050B16] line-clamp-2 leading-snug mb-2 min-h-[36px] hover:text-emerald-600 transition">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Étoiles */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar key={s} size={9} className="text-amber-400" />
                    ))}
                  </div>

                  {/* Prix */}
                  <p className="text-emerald-600 font-bold text-base mb-3 mt-auto">
                    {formatPrice(item.price)}
                  </p>

                  {/* ============================================================
                      ACTIONS (panier + aperçu)
                  ============================================================ */}
                  <div className="space-y-2">
                    {/* Ajouter au panier */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAdded}
                      className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wide transition flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <FaCheckCircle size={10} /> Ajouté
                        </>
                      ) : (
                        <>
                          <FaBolt size={10} /> Ajouter au panier
                        </>
                      )}
                    </button>

                    {/* Lien voir produit */}
                    <Link
                      href={`/produit/${item.id}`}
                      className="w-full border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 py-1.5 rounded text-[10px] font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <FaEye size={9} /> Voir le produit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================================
            CTA FINAL
        ================================================================== */}
        <div className="mt-12 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold px-6 py-3 rounded-lg transition"
          >
            <FaArrowLeft size={12} /> Continuer mes achats
          </Link>
        </div>
      </div>

      {/* ==================================================================
          MODAL DE CONFIRMATION (vider les favoris)
      ================================================================== */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FaTrash size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#050B16] mb-2">
              Vider vos favoris ?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Cette action supprimera les {totalItems} produit{totalItems > 1 ? 's' : ''} de votre liste.
              Elle est irréversible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  clearWishlist();
                  setShowClearConfirm(false);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition text-sm"
              >
                Oui, vider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}