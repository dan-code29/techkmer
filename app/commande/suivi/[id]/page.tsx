'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaCheckCircle, 
  FaTruck, 
  FaBox, 
  FaHome,
  FaMapMarkerAlt, 
  FaArrowLeft, 
  FaWhatsapp
} from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
type TrackingStep = {
  id: number;
  status: string;
  title: string;
  description: string;
  location: string;
  created_at: string;
};

// Les étapes standards
const STEPS = [
  { key: 'paid', label: 'Payée', icon: FaCheckCircle },
  { key: 'shipped', label: 'Expédiée', icon: FaBox },
  { key: 'out_for_delivery', label: 'En livraison', icon: FaTruck },
  { key: 'delivered', label: 'Livrée', icon: FaHome },
];

// ============================================================================
//  COMPOSANT PRINCIPAL
// ============================================================================
export default function TrackingPage() {
  const { id } = useParams();
  
  // On initialise avec un tableau vide pour éviter les crashs
  const [history, setHistory] = useState<TrackingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('paid');

  useEffect(() => {
    if (!id) return;

    // Appel à l'API (si l'API n'existe pas encore, on gère l'erreur proprement)
    fetch(`/api/orders/${id}/tracking`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistory(data);
          setCurrentStatus(data[0].status); 
        }
      })
      .catch((err) => {
        console.log("Pas encore d'historique en base", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Trouver l'index de l'étape actuelle
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStatus);

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Chargement du suivi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/commande/confirmation" className="text-gray-600 hover:text-[#0066FF]">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg text-[#050B16]">Suivi de commande</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        
        {/* Résumé */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Commande</span>
            <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2 py-1 rounded">#{id}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#050B16]">
            {currentStatus === 'delivered' ? 'Commande livrée' : 'Livraison en cours'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Merci pour votre confiance CHEFFBUILD.</p>
        </div>

        {/* Barre de progression */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="relative flex justify-between">
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10" />
            <div
              className="absolute top-5 left-0 h-1 bg-[#0066FF] -z-10 transition-all duration-500"
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (STEPS.length - 1)) * 100 : 0}%` }}
            />

            {STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[10px] font-bold text-center max-w-[60px] leading-tight ${
                    isActive ? 'text-[#050B16]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline / Historique */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#050B16] mb-6">Historique de livraison</h3>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              En attente de mise à jour par notre équipe logistique...
            </p>
          ) : (
            <div className="space-y-6">
              {history.map((event, index) => {
                const date = new Date(event.created_at);
                return (
                  <div key={event.id} className="flex gap-4 relative">
                    
                    {/* Ligne verticale */}
                    {index !== history.length - 1 && (
                      <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gray-100" />
                    )}
                    
                    {/* Point lumineux */}
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 z-10 ${
                      index === 0 ? 'bg-[#00C2FF] ring-4 ring-[#00C2FF]/20' : 'bg-gray-300'
                    }`} />

                    {/* Détails de l'événement */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-bold text-sm ${index === 0 ? 'text-[#0066FF]' : 'text-[#050B16]'}`}>
                          {event.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.location && (
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <FaMapMarkerAlt size={10} /> {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton WhatsApp */}
        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/237697654023?text=Bonjour, je souhaite avoir des informations sur ma commande %23${id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:underline"
          >
            <FaWhatsapp size={16} /> Besoin d'aide avec cette commande ?
          </a>
        </div>

      </div>
    </div>
  );
}