'use client';

import { useState } from 'react';

const products = [
  { id: 1, name: 'Perceuse sans fil', price: 89.99, image: '🔨', category: 'Outillage' },
  { id: 2, name: 'Tournevis électrique', price: 49.99, image: '🪛', category: 'Outillage' },
  { id: 3, name: 'Multimètre numérique', price: 34.99, image: '📏', category: 'Mesure' },
  { id: 4, name: 'Niveau laser', price: 129.99, image: '📐', category: 'Mesure' },
  { id: 5, name: 'Kit de clés à chocs', price: 79.99, image: '🔧', category: 'Outillage' },
  { id: 6, name: 'Caméra thermique', price: 299.99, image: '📷', category: 'Inspection' },
];

export default function BoutiquePage() {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
    alert(`Produit ajouté au panier ! (${cart.length + 1} article(s))`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Notre boutique</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="text-6xl text-center py-8 bg-gray-100">{product.image}</div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">{product.price} €</p>
              <button
                onClick={() => addToCart(product.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}