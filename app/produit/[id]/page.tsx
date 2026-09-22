// ============================================================================
//  IMPORTS
// ============================================================================
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { turso } from '@/lib/turso';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';
import ProductWishlistButton from '@/components/ProductWishlistButton'; // ✅ NOUVEAU
import {
  FaStar, FaCheckCircle, FaTruck, FaShieldAlt, FaUndo,
  FaHeadset, FaArrowLeft, FaBoxOpen, FaPlus,
  FaChevronRight, FaPhone, FaWhatsapp,
} from 'react-icons/fa';

// ============================================================================
//  MAP DES CATÉGORIES COMPLÉMENTAIRES
//  Associe chaque catégorie à ses catégories complémentaires
//  Utilisé pour la section "Complétez votre solution"
// ============================================================================
const COMPLEMENTARY_MAP: Record<string, string[]> = {
  'Electrical': ['Solar Energy', 'Accessories'],
  'Solar Energy': ['Electrical', 'Accessories'],
  'Networking': ['Accessories', 'CCTV & Surveillance'],
  'Smart Home': ['Electrical', 'Accessories'],
  'CCTV & Surveillance': ['Networking', 'Accessories', 'Access Control'],
  'Access Control': ['CCTV & Surveillance', 'Accessories'],
  'Automation': ['Electrical', 'Access Control'],
  'Electric Fence': ['Electrical', 'CCTV & Surveillance'],
  'Accessories': ['Electrical', 'Networking'],
};

// ============================================================================
//  FONCTIONS DE RÉCUPÉRATION DES DONNÉES (côté serveur)
// ============================================================================

// ---------------------------------------------------------------------------
//  Récupérer un produit par son ID
// ---------------------------------------------------------------------------
async function getProduct(id: number) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id],
    });
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erreur getProduct:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
//  Récupérer les produits complémentaires
//  - Prend la catégorie du produit actuel
//  - Cherche dans les catégories associées (via COMPLEMENTARY_MAP)
//  - Exclut le produit actuel
//  - Limite à 6 résultats, triés par ventes
// ---------------------------------------------------------------------------
async function getComplementaryProducts(category: string, excludeId: number) {
  try {
    const targetCats = COMPLEMENTARY_MAP[category] || [];
    if (targetCats.length === 0) return [];

    // Construire les placeholders pour la clause IN (?,?,?)
    const placeholders = targetCats.map(() => '?').join(',');

    const result = await turso.execute({
      sql: `SELECT * FROM products 
            WHERE category IN (${placeholders}) 
            AND id != ? 
            ORDER BY salesCount DESC 
            LIMIT 6`,
      args: [...targetCats, excludeId],
    });

    return result.rows;
  } catch (error) {
    console.error('Erreur getComplementaryProducts:', error);
    return [];
  }
}

// ============================================================================
//  MÉTADONNÉES SEO DYNAMIQUES
// ============================================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(parseInt(id));

  if (!product) return { title: 'Produit non trouvé' };

  return {
    title: `${product.name} — CHEFFBUILD Smart Systems`,
    description: product.description
      ? String(product.description).slice(0, 155)
      : `Découvrez ${product.name} sur CHEFFBUILD Smart Systems`,
  };
}

// ============================================================================
//  PAGE PRODUIT (Server Component)
// ============================================================================
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ---------------------------------------------------------------
  //  Récupération du produit
  // ---------------------------------------------------------------
  const { id } = await params;
  const productId = parseInt(id);
  const product = await getProduct(productId);
  if (!product) return notFound();

  // ---------------------------------------------------------------
  //  Nettoyage des valeurs (Turso peut retourner null)
  // ---------------------------------------------------------------
  const productName = product.name ? String(product.name) : 'Produit';
  const productCategory = product.category ? String(product.category) : '';
  const rawPrice = product.price;
  const productPrice =
    typeof rawPrice === 'number' ? rawPrice : rawPrice ? Number(rawPrice) : 0;
  const productDescription = product.description
    ? String(product.description)
    : 'Aucune description disponible pour ce produit.';
  const imageSrc =
    product.image && typeof product.image === 'string'
      ? product.image
      : '/images/placeholder.jpg';
  const salesCount = Number(product.salesCount) || 0;
  const isPromotion = Number(product.isPromotion) === 1;

  // Calcul du prix barré si en promo
  const discount = isPromotion ? 20 : 0;
  const oldPrice = isPromotion ? Math.round(productPrice / 0.8) : 0;

  // ---------------------------------------------------------------
  //  Chargement des produits complémentaires
  // ---------------------------------------------------------------
  const complementary = await getComplementaryProducts(
    productCategory,
    productId
  );

  // ---------------------------------------------------------------
  //  Données à passer au bouton panier (objet simple)
  // ---------------------------------------------------------------
  const cartProduct = {
    id: productId,
    name: productName,
    price: productPrice,
    image: imageSrc,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* ==================================================================
            FIL D'ARIANE
        ================================================================== */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-600 transition">
            Accueil
          </Link>
          <FaChevronRight size={9} />
          <Link href="/boutique" className="hover:text-emerald-600 transition">
            Boutique
          </Link>
          {productCategory && (
            <>
              <FaChevronRight size={9} />
              <Link
                href={`/boutique?cat=${encodeURIComponent(productCategory)}`}
                className="hover:text-emerald-600 transition"
              >
                {productCategory}
              </Link>
            </>
          )}
          <FaChevronRight size={9} />
          <span className="text-[#050B16] font-semibold truncate max-w-[200px]">
            {productName}
          </span>
        </nav>

        {/* ==================================================================
            FICHE PRODUIT : 2 COLONNES
        ================================================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">

            {/* =============================================================
                COLONNE GAUCHE : IMAGE + BADGES DE RÉASSURANCE
            ============================================================= */}
            <div>
              <div className="relative h-[400px] md:h-[500px] bg-gray-50 rounded-xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={productName}
                  fill
                  className="object-contain p-8"
                  priority
                />

                {/* Badge promo */}
                {isPromotion && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                    -{discount}%
                  </span>
                )}

                {/* Badge TOP */}
                {salesCount > 50 && (
                  <span className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                    🔥 TOP VENTE
                  </span>
                )}
              </div>

              {/* Bandeau de réassurance sous l'image */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <FaShieldAlt className="text-emerald-600 mx-auto mb-1.5" size={16} />
                  <p className="text-[10px] text-gray-600 font-bold leading-tight">
                    Garantie<br />12 mois
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <FaTruck className="text-emerald-600 mx-auto mb-1.5" size={16} />
                  <p className="text-[10px] text-gray-600 font-bold leading-tight">
                    Livraison<br />rapide
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <FaUndo className="text-emerald-600 mx-auto mb-1.5" size={16} />
                  <p className="text-[10px] text-gray-600 font-bold leading-tight">
                    Retour<br />sous 7j
                  </p>
                </div>
              </div>
            </div>

            {/* =============================================================
                COLONNE DROITE : INFORMATIONS PRODUIT
            ============================================================= */}
            <div className="flex flex-col">

              {/* Catégorie + bouton wishlist */}
              <div className="flex items-center justify-between mb-3">
                {productCategory && (
                  <Link
                    href={`/boutique?cat=${encodeURIComponent(productCategory)}`}
                    className="inline-block bg-[#00C2FF]/10 text-[#00A8DD] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest hover:bg-[#00C2FF]/20 transition"
                  >
                    {productCategory}
                  </Link>
                )}

                {/* Bouton wishlist (composant client) */}
                <ProductWishlistButton
                  product={{
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: imageSrc,
                    category: productCategory,
                  }}
                />
              </div>

              {/* Titre */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#050B16] mb-3 leading-tight">
                {productName}
              </h1>

              {/* Étoiles + stock */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar key={s} size={14} className="text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({Math.round(salesCount / 10)} avis clients)
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold ml-auto">
                  <FaCheckCircle size={11} /> En stock
                </span>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-emerald-600">
                  {formatPrice(productPrice)}
                </span>
                {isPromotion && (
                  <>
                    <span className="text-gray-400 line-through text-xl">
                      {formatPrice(oldPrice)}
                    </span>
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">
                      Économisez {formatPrice(oldPrice - productPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                {productDescription}
              </p>

              {/* Points forts */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={14} />
                  <span>Produit original et certifié</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={14} />
                  <span>Assistance technique après-vente</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={14} />
                  <span>Paiement à la livraison disponible</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={14} />
                  <span>Installation possible sur devis</span>
                </div>
              </div>

              {/* Bouton panier + contact rapide + devis */}
              <div className="mt-auto space-y-3">
                {/* Bouton Ajouter au panier (composant client) */}
                <AddToCartButton product={cartProduct} />

                {/* Contact rapide */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/237697654023"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition text-sm"
                  >
                    <FaWhatsapp size={14} /> WhatsApp
                  </a>
                  <a
                    href="tel:+237697654023"
                    className="flex items-center justify-center gap-2 border-2 border-[#050B16] text-[#050B16] hover:bg-[#050B16] hover:text-white font-semibold py-3 rounded-lg transition text-sm"
                  >
                    <FaPhone size={12} /> Appeler
                  </a>
                </div>

                {/* Demande de devis pour ce produit */}
                <Link
                  href={`/devis?produit=${productId}`}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition text-sm"
                >
                  🛠️ Demander un devis pour ce produit
                </Link>
              </div>
            </div>
          </div>

          {/* ==================================================================
              BANDEAU GARANTIES (bas de fiche)
          ================================================================== */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 md:px-8 py-4">
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

        {/* ==================================================================
            SECTION : COMPLÉTEZ VOTRE SOLUTION
        ================================================================== */}
        {complementary.length > 0 && (
          <section className="mb-12">
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                <FaPlus size={18} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#050B16]">
                  Complétez votre solution
                </h2>
                <p className="text-sm text-gray-500">
                  Accessoires et équipements compatibles avec ce produit
                </p>
              </div>
              <Link
                href={`/boutique?cat=${encodeURIComponent(productCategory)}`}
                className="text-xs font-bold text-emerald-600 hover:underline hidden sm:block whitespace-nowrap"
              >
                Voir tout →
              </Link>
            </div>

            {/* Grille de produits complémentaires */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complementary.map((item: any) => {
                const itemImage =
                  item.image && typeof item.image === 'string'
                    ? item.image
                    : '/images/placeholder.jpg';
                const itemPrice =
                  typeof item.price === 'number'
                    ? item.price
                    : Number(item.price) || 0;
                const itemName = item.name ? String(item.name) : 'Produit';
                const itemCategory = item.category ? String(item.category) : '';

                return (
                  <Link
                    key={item.id}
                    href={`/produit/${item.id}`}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-32 bg-gray-50">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Contenu */}
                    <div className="p-3 flex flex-col flex-1">
                      {itemCategory && (
                        <p className="text-[9px] text-[#00C2FF] font-bold uppercase tracking-widest mb-1 truncate">
                          {itemCategory}
                        </p>
                      )}
                      <h3 className="text-xs font-semibold text-[#050B16] line-clamp-2 leading-snug mb-2 min-h-[32px] group-hover:text-emerald-600 transition">
                        {itemName}
                      </h3>
                      <p className="text-emerald-600 font-bold text-sm mt-auto">
                        {formatPrice(itemPrice)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================================================================
            CTA FINAL : BESOIN D'UN CONSEIL ?
        ================================================================== */}
        <section className="rounded-2xl bg-gradient-to-r from-[#050B16] via-[#0a1a3a] to-[#050B16] p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#00C2FF,transparent_50%)]" />
          <div className="relative">
            <p className="text-[#00C2FF] text-xs font-bold uppercase tracking-[0.3em] mb-3">
              Besoin d&apos;un conseil ?
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Une question sur ce produit ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Notre équipe technique est disponible pour vous conseiller et
              vous proposer la meilleure solution pour votre projet.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/devis"
                className="bg-[#00C2FF] hover:bg-[#00a8dd] text-[#050B16] font-bold py-3 px-8 rounded-lg transition"
              >
                Demander un devis
              </Link>
              <a
                href="https://wa.me/237697654023"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================================
            BOUTON RETOUR
        ================================================================== */}
        <div className="mt-8 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline"
          >
            <FaArrowLeft size={12} /> Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}