'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Ajouter au panier
      </button>
      {added && <p className="text-green-600 mt-2">✓ Produit ajouté au panier</p>}
    </div>
  );
}