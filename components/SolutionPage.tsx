'use client';

// ============================================================================
//  IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import {
  FaArrowRight, FaWhatsapp, FaPhone, FaFileAlt,
  FaCheckCircle, FaCog,
} from 'react-icons/fa';

// ============================================================================
//  TYPES
// ============================================================================
export type SubService = {
  icon: string;
  title: string;
  desc: string;
};

export type SolutionPageProps = {
  // Identité
  id: string;                  // 'electrical', 'connectivity'...
  label: string;               // 'ENERGY', 'CONNECTIVITY'...
  title: string;               // Titre principal
  subtitle: string;            // Sous-titre
  description: string;         // Description longue
  heroImage: string;           // Image de fond du hero
  accentColor: string;         // ex: 'amber', 'blue', 'cyan'...

  // Contenu
  subServices: SubService[];   // Liste des sous-services
  productCategories: string[]; // Catégories BDD à afficher (ex: ['Electrical', 'Solar Energy'])
  benefits: string[];          // Liste des bénéfices
};

// ============================================================================
//  COMPOSANT
// ============================================================================
export default function SolutionPage({
  id,
  label,
  title,
  subtitle,
  description,
  heroImage,
  accentColor,
  subServices,
  productCategories,
  benefits,
}: SolutionPageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les produits des catégories liées
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        const filtered = (Array.isArray(data) ? data : []).filter((p: any) =>
          productCategories.includes(p.category)
        );
        setProducts(filtered.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productCategories]);

  // Classe de couleur d'accentuation (Tailwind ne supporte pas les classes dynamiques en string)
  const accentClasses: Record<string, { bg: string; text: string; border: string }> = {
    amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500' },
    red: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
  };
  const accent = accentClasses[accentColor] || accentClasses.blue;

  return (
    <div className="bg-white">

      {/* ==================================================================
          HERO
      ================================================================== */}
      <section className="relative text-white overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B16]/95 via-[#050B16]/75 to-[#050B16]/30" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 py-20 max-w-3xl">
          <Link
            href="/#solutions"
            className="inline-flex items-center gap-2 text-[#00C2FF] text-xs font-bold uppercase tracking-widest mb-4 hover:gap-3 transition-all"
          >
            ← Toutes nos solutions
          </Link>

          <span className="block text-[#00C2FF] text-xs font-bold uppercase tracking-[0.3em] mb-3">
            {label}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/devis"
              className={`${accent.bg} hover:opacity-90 text-white font-bold py-4 px-8 rounded-lg transition flex items-center gap-2`}
            >
              <FaFileAlt size={14} /> Demander un devis
            </Link>
            <a
              href="https://wa.me/237697654023"
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition flex items-center gap-2"
            >
              <FaWhatsapp size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================================
          DESCRIPTION + SOUS-SERVICES
      ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#050B16] mb-4">
              Nos prestations
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subServices.map((s, i) => (
              <div
                key={i}
                className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#00C2FF] rounded-2xl p-6 transition hover:shadow-lg"
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-[#050B16] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          BENEFITS
      ================================================================== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#050B16] mb-8 text-center">
            Pourquoi choisir CHEFFBUILD ?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <FaCheckCircle className={`${accent.text} shrink-0 mt-0.5`} size={16} />
                <p className="text-sm text-gray-700">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          PRODUITS LIÉS
      ================================================================== */}
      {products.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between mb-10">
              <div>
                <p className={`${accent.text} font-bold text-xs uppercase tracking-[0.3em] mb-2`}>
                  Boutique
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#050B16]">
                  Équipements recommandés
                </h2>
              </div>
              <Link
                href={`/boutique?cat=${encodeURIComponent(productCategories[0] || '')}`}
                className={`${accent.text} font-semibold hover:underline flex items-center gap-2`}
              >
                Voir toute la boutique <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => {
                const img = p.image && typeof p.image === 'string' ? p.image : '/images/placeholder.jpg';
                return (
                  <Link
                    key={p.id}
                    href={`/produit/${p.id}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition"
                  >
                    <div className="relative h-40 bg-gray-50">
                      <Image src={img} alt={p.name} fill className="object-contain p-4 group-hover:scale-105 transition" />
                    </div>
                    <div className="p-3">
                      <p className={`text-[10px] ${accent.text} font-bold uppercase tracking-widest mb-1`}>
                        {p.category}
                      </p>
                      <h3 className="text-sm font-semibold text-[#050B16] line-clamp-2 mb-2 min-h-[36px]">
                        {p.name}
                      </h3>
                      <p className="font-bold text-[#0066FF]">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================
          CTA FINAL
      ================================================================== */}
      <section className={`py-20 ${accent.bg} text-white`}>
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un projet en {title.toLowerCase()} ?
          </h2>
          <p className="text-white/90 mb-8">
            Notre équipe vous accompagne de la conception à la maintenance.
            Devis gratuit sous 24h.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/devis"
              className="bg-white text-[#050B16] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition"
            >
              Demander un devis gratuit
            </Link>
            <a
              href="tel:+237697654023"
              className="border-2 border-white/40 hover:border-white font-bold py-4 px-8 rounded-lg transition flex items-center gap-2"
            >
              <FaPhone size={14} /> 697654023
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}