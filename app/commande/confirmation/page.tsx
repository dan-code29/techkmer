'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaTruck,
  FaShoppingBag,
  FaHome,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa';

// ============================================================================
//  COMPOSANT INTERNE (utilise useSearchParams)
// ============================================================================
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-md mx-auto">
        
        {/* ==================================================================
            EN-TÊTE : SUCCÈS
        ================================================================== */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm">
            <FaCheckCircle className="text-emerald-500" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-[#050B16] mb-3">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Merci pour votre confiance. Votre commande a bien été enregistrée
            et sera traitée dans les plus brefs délais.
          </p>
        </div>

        {/* ==================================================================
            NUMÉRO DE COMMANDE
        ================================================================== */}
        {orderId && (
          <div className="bg-white border border-gray-100 p-6 rounded-2xl mb-6 shadow-sm text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">
              Numéro de commande
            </p>
            <p className="font-mono text-2xl font-bold text-[#0066FF]">
              #{orderId}
            </p>
          </div>
        )}

        {/* ==================================================================
            PROCHAINES ÉTAPES
        ================================================================== */}
        <div className="bg-[#00C2FF]/5 border border-[#00C2FF]/20 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-[#050B16] mb-4 flex items-center gap-2">
            <FaEnvelope className="text-[#00C2FF]" /> Prochaines étapes
          </h3>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Un email de confirmation a été envoyé à votre adresse.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Notre équipe vous contactera pour confirmer la livraison.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Vous pouvez suivre l'évolution de votre colis en temps réel.
            </li>
          </ul>
        </div>

        {/* ==================================================================
            ACTIONS (Tracking + Boutique)
        ================================================================== */}
        <div className="space-y-4">
          {/* ✅ BOUTON PRINCIPAL : SUIVI DE COMMANDE */}
          {orderId && (
            <Link
              href={`/commande/suivi/${orderId}`}
              className="w-full flex items-center justify-center gap-3 bg-[#0066FF] text-white px-6 py-4 rounded-xl hover:bg-[#0052cc] font-bold transition shadow-lg shadow-[#0066FF]/30"
            >
              <FaTruck size={20} />
              Suivre ma commande
            </Link>
          )}

          {/* Boutons secondaires */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/boutique"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#050B16] px-4 py-3 rounded-xl hover:border-[#00C2FF] hover:text-[#0066FF] font-semibold transition text-sm"
            >
              <FaShoppingBag size={14} /> Boutique
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#050B16] px-4 py-3 rounded-xl hover:border-[#00C2FF] hover:text-[#0066FF] font-semibold transition text-sm"
            >
              <FaHome size={14} /> Accueil
            </Link>
          </div>
        </div>

        {/* ==================================================================
            CONTACT RAPIDE
        ================================================================== */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-2">Une question sur votre commande ?</p>
          <a
            href={`https://wa.me/237697654023?text=Bonjour, j'ai une question concernant ma commande %23${orderId || ''}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-bold hover:underline"
          >
            <FaWhatsapp size={18} /> Contactez-nous sur WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
//  COMPOSANT PRINCIPAL AVEC SUSPENSE
//  (Obligatoire pour useSearchParams dans Next.js 14+)
// ============================================================================
export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-4">Chargement de la confirmation...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}