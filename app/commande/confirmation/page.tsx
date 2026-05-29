'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Composant interne qui utilise useSearchParams
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
            <p className="font-mono text-lg font-semibold">#{orderId}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Prochaines étapes</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Un email de confirmation a été envoyé à votre adresse</li>
            <li>✓ Nous vous contacterons pour confirmer les détails de livraison</li>
            <li>✓ Vous recevrez votre commande à la date prévue</li>
            <li>✓ Un SMS de confirmation sera envoyé avant la livraison</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/boutique"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Continuer les achats
          </Link>
          <Link
            href="/"
            className="block border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>Des questions ? <Link href="/contact" className="text-blue-600 hover:underline">Contactez-nous</Link></p>
        </div>
      </div>
    </div>
  );
}

// Composant principal avec Suspense
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Chargement de la confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}