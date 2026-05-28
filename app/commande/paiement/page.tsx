'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

type OrderData = {
  items: Array<{ id: number; name: string; quantity: number; price: number }>;
  totalPrice: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
};

export default function PaymentPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'orange' | 'mtn' | 'card' | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Récupérer les données de la commande depuis sessionStorage
    const data = sessionStorage.getItem('orderData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setOrderData(parsed);
        setLoading(false);
      } catch (err) {
        console.error('Erreur parsing orderData:', err);
        setLoading(false);
      }
    } else {
      // Rediriger vers la page commande si pas de données
      router.push('/commande');
    }
  }, [router]);

  const handlePayment = async () => {
    if (!selectedPayment || !orderData) return;

    setProcessing(true);

    try {
      // Envoyer la commande au backend avec le mode de paiement
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: selectedPayment,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur lors de la création de la commande');
      }

      const result = await res.json();
      console.log('✅ Commande créée:', result);

      // Nettoyer sessionStorage
      sessionStorage.removeItem('orderData');

      // Rediriger vers la page de confirmation
      router.push(`/commande/confirmation?orderId=${result.id}`);
    } catch (err: any) {
      console.error('❌ Erreur paiement:', err);
      alert(err.message || 'Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p>Impossible de charger les données de la commande.</p>
        <Link href="/commande" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Retour à la commande
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Paiement de la commande</h1>

      {/* Récapitulatif de la commande */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Client</h3>
          <p><strong>{orderData.name}</strong></p>
          <p>{orderData.email}</p>
          <p>{orderData.phone}</p>
          <p className="text-sm text-gray-600 mt-2">Livraison : {new Date(orderData.deliveryDate).toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Articles</h3>
          {orderData.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 font-bold text-lg flex justify-between">
          <span>Total à payer :</span>
          <span className="text-green-600">{formatPrice(orderData.totalPrice)}</span>
        </div>
      </div>

      {/* Sélection du mode de paiement */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Choisir un moyen de paiement</h2>

        {/* Orange Money */}
        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
          selectedPayment === 'orange' ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="radio"
            name="payment"
            value="orange"
            checked={selectedPayment === 'orange'}
            onChange={() => setSelectedPayment('orange')}
            className="w-5 h-5 mt-1 mr-4"
          />
          <div className="flex-1">
            <p className="font-semibold text-lg">🟠 Orange Money</p>
            <p className="text-sm text-gray-600">Paiement sécurisé via Orange Money</p>
            <p className="text-xs text-gray-500 mt-2">Numéro destinataire : +221 XX XXX XX XX</p>
          </div>
        </label>

        {/* MTN Mobile Money */}
        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
          selectedPayment === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="radio"
            name="payment"
            value="mtn"
            checked={selectedPayment === 'mtn'}
            onChange={() => setSelectedPayment('mtn')}
            className="w-5 h-5 mt-1 mr-4"
          />
          <div className="flex-1">
            <p className="font-semibold text-lg">🟡 MTN Mobile Money</p>
            <p className="text-sm text-gray-600">Paiement sécurisé via MTN Mobile Money</p>
            <p className="text-xs text-gray-500 mt-2">Numéro destinataire : +221 XX XXX XX XX</p>
          </div>
        </label>

        {/* Carte bancaire */}
        <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
          selectedPayment === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selectedPayment === 'card'}
            onChange={() => setSelectedPayment('card')}
            className="w-5 h-5 mt-1 mr-4"
          />
          <div className="flex-1">
            <p className="font-semibold text-lg">💳 Carte bancaire</p>
            <p className="text-sm text-gray-600">Visa, Mastercard ou autres cartes internationales</p>
            <p className="text-xs text-gray-500 mt-2">Paiement sécurisé via passerelle certifiée</p>
          </div>
        </label>
      </div>

      {/* Informations supplémentaires */}
      {selectedPayment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          {selectedPayment === 'orange' && (
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">💡 Comment payer avec Orange Money ?</h3>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Composez <strong>#144#</strong> sur votre téléphone Orange</li>
                <li>Sélectionnez "Paiements"</li>
                <li>Entrez le numéro de bénéficiaire</li>
                <li>Confirmez le montant</li>
                <li>Vous recevrez une confirmation par SMS</li>
              </ol>
            </div>
          )}
          {selectedPayment === 'mtn' && (
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">💡 Comment payer avec MTN Mobile Money ?</h3>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Composez <strong>*182*</strong> sur votre téléphone MTN</li>
                <li>Sélectionnez "Send Money"</li>
                <li>Entrez le numéro de bénéficiaire</li>
                <li>Confirmez le montant</li>
                <li>Vous recevrez une confirmation par SMS</li>
              </ol>
            </div>
          )}
          {selectedPayment === 'card' && (
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">💡 Informations de paiement par carte</h3>
              <p className="text-sm text-blue-800 mb-2">Vous serez redirigé vers une page de paiement sécurisée.</p>
              <p className="text-sm text-blue-800">Acceptées : Visa, Mastercard, Verve et autres cartes internationales</p>
            </div>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-4">
        <button
          onClick={handlePayment}
          disabled={!selectedPayment || processing}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition"
        >
          {processing ? 'Traitement en cours...' : 'Procéder au paiement'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
        >
          Retour
        </button>
      </div>

      {/* Avis de sécurité */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>🔒 Vos informations de paiement sont entièrement sécurisées et chiffrées</p>
      </div>
    </div>
  );
}
