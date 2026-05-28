'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: '',
    paymentMethod: 'delivery', // 'delivery' ou 'online'
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Calculer la date minimum (aujourd'hui + 2 jours)
  const getMinDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!form.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!form.email.trim()) {
      setError('L\'email est requis');
      return;
    }
    if (!form.phone.trim()) {
      setError('Le numéro de téléphone est requis');
      return;
    }
    if (!/^\+?[0-9\s\-()]{8,}$/.test(form.phone)) {
      setError('Le numéro de téléphone est invalide');
      return;
    }
    if (!form.address.trim()) {
      setError('L\'adresse est requise');
      return;
    }
    if (!form.deliveryDate) {
      setError('La date de livraison est requise');
      return;
    }

    // Si paiement en ligne, rediriger vers la page de paiement
    if (form.paymentMethod === 'online') {
      const orderData = {
        items,
        totalPrice,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        deliveryDate: form.deliveryDate,
      };
      // Passer les données via sessionStorage ou URL
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      router.push('/commande/paiement');
      return;
    }

    // Paiement à la livraison
    console.log('Commande à la livraison', { items, totalPrice, ...form });
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
        <h1 className="text-2xl font-bold mb-4 text-green-600">✅ Commande confirmée !</h1>
        <p className="mb-4">Votre commande a été reçue et sera livrée le <strong>{new Date(form.deliveryDate).toLocaleDateString('fr-FR')}</strong>.</p>
        <p className="mb-6 text-gray-600">Nous vous contacterons au <strong>{form.phone}</strong> pour confirmer les détails.</p>
        <Link href="/boutique" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Finaliser la commande</h1>
      
      {/* Récapitulatif du panier */}
      <div className="bg-gray-100 p-4 rounded mb-8">
        <h2 className="font-semibold mb-4">Récapitulatif du panier</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-2 font-bold text-lg flex justify-between">
          <span>Total</span>
          <span className="text-green-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Informations personnelles */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Nom complet *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded p-2"
                placeholder="Jean Dupont"
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
                placeholder="jean@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Numéro de téléphone *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="+221 77 123 45 67 ou 77 123 45 67"
            />
            <p className="text-sm text-gray-500 mt-1">Format: +221 77 123 45 67 ou 77 123 45 67</p>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
          <div>
            <label className="block font-medium mb-1">Adresse complète *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Rue, numéro, quartier, ville..."
            />
          </div>
        </div>

        {/* Date de livraison */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Date de livraison</h2>
          <div>
            <label className="block font-medium mb-1">Choisir un jour de livraison *</label>
            <input
              type="date"
              required
              min={getMinDeliveryDate()}
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
              className="w-full border rounded p-2"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 2 jours après aujourd'hui</p>
          </div>
        </div>

        {/* Mode de paiement */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50" style={{borderColor: form.paymentMethod === 'delivery' ? '#059669' : '#d1d5db'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="delivery"
                checked={form.paymentMethod === 'delivery'}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-4 h-4 mr-3"
              />
              <div>
                <p className="font-semibold">Paiement à la livraison</p>
                <p className="text-sm text-gray-600">Payez lorsque vous recevez votre commande</p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50" style={{borderColor: form.paymentMethod === 'online' ? '#059669' : '#d1d5db'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={form.paymentMethod === 'online'}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-4 h-4 mr-3"
              />
              <div>
                <p className="font-semibold">Paiement en ligne</p>
                <p className="text-sm text-gray-600">Orange Money, MTN Mobile Money ou Carte bancaire</p>
              </div>
            </label>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            {form.paymentMethod === 'online' ? 'Procéder au paiement' : 'Confirmer la commande'}
          </button>
          <Link 
            href="/panier" 
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Retour au panier
          </Link>
        </div>
      </form>
    </div>
  );
}