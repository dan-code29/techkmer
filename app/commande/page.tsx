'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez envoyer la commande à votre API ou email
    console.log('Commande envoyée', { items, totalPrice, ...form });
    clearCart();
    setSubmitted(true);
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/boutique" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Continuer vos achats
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Commande envoyée !</h1>
        <p>Nous vous contacterons rapidement pour confirmer.</p>
        <Link href="/boutique" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Finaliser la commande</h1>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Récapitulatif</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-bold flex justify-between">
          <span>Total</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nom complet *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Adresse de livraison *</label>
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700">
          Confirmer la commande
        </button>
      </form>
    </div>
  );
}