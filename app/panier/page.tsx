'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/boutique" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Continuer vos achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Votre panier</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-4 border-b pb-4">
            <div className="relative w-20 h-20">
              <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-600">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold">
              {formatPrice(item.price * item.quantity)}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4 text-right">
        <p className="text-xl font-bold">Total : {formatPrice(totalPrice)}</p>
        <div className="mt-4 flex gap-4 justify-end">
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Vider le panier
          </button>
          <Link
            href="/commande"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  );
}