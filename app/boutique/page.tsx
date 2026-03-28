'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

// Définition des produits avec catégorie
const allProducts = [
  { id: 1, name: 'Perceuse sans fil', price: 89.99, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format', category: 'Outillage', bestSeller: true },
  { id: 2, name: 'Tournevis électrique', price: 49.99, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format', category: 'Outillage', bestSeller: false },
  { id: 3, name: 'Multimètre numérique', price: 34.99, image: 'https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=600&auto=format', category: 'Mesure', bestSeller: false },
  { id: 4, name: 'Niveau laser', price: 129.99, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format', category: 'Mesure', bestSeller: true },
  { id: 5, name: 'Kit de clés à chocs', price: 79.99, image: 'https://images.unsplash.com/photo-1581147036324-c19e9e1a2b3b?w=600&auto=format', category: 'Outillage', bestSeller: false },
  { id: 6, name: 'Caméra thermique', price: 299.99, image: 'https://images.unsplash.com/photo-1581092921461-39e9b6b3b1a5?w=600&auto=format', category: 'Inspection', bestSeller: false },
];

export default function BoutiquePage() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('default');
  const [showAlert, setShowAlert] = useState(false);
  const [lastProduct, setLastProduct] = useState('');

  // Extraire les catégories uniques
  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Trier
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-seller':
        filtered = filtered.filter(p => p.bestSeller);
        break;
      default:
        // default: garder l'ordre original
        break;
    }
    return filtered;
  }, [selectedCategory, sortOption]);

  const handleAddToCart = (product: typeof allProducts[0]) => {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Notre boutique</h1>
      {showAlert && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {lastProduct} ajouté au panier !
        </div>
      )}

      {/* Barre de navigation secondaire */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b pb-4">
        {/* Filtres par catégorie */}
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

        {/* Tri */}
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

      {/* Affichage des produits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="relative h-48">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">{product.price} €</p>
              {product.bestSeller && (
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

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun produit ne correspond à cette catégorie.
        </div>
      )}
    </div>
  );
}