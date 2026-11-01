import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowRight, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle,
} from 'react-icons/fa';
import { turso } from '@/lib/turso';
import ProjectCarousel from '@/components/ProjectCarousel';
import { CATEGORY_LABELS, CATEGORY_STYLES } from '@/lib/projects';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await turso.execute({ sql: 'SELECT title FROM projects WHERE id = ?', args: [id] });
  
  if (result.rows.length === 0) return { title: 'Réalisation introuvable' };
  return { title: `${result.rows[0].title} | CHEFFBUILD` };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. On va chercher LE projet précis dans Turso
  const result = await turso.execute({
    sql: 'SELECT * FROM projects WHERE id = ?',
    args: [id]
  });

  if (result.rows.length === 0) notFound();

  // 2. On formate les données (avec sécurité pour le statut)
  const raw = result.rows[0];
  const project: any = {
    ...raw,
    id: Number(raw.id),
    status: raw.status || 'termine', // 👈 Sécurité si pas de statut
    images: JSON.parse(raw.images as string || '[]'),
    features: JSON.parse(raw.features as string || '[]'),
    shortDesc: raw.short_desc
  };

  const styles = CATEGORY_STYLES[project.category as keyof typeof CATEGORY_STYLES];
  const catLabel = CATEGORY_LABELS[project.category as keyof typeof CATEGORY_LABELS];
  const isEnCours = project.status === 'en_cours';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#E6FBFF]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#0066FF]/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-8">
          <nav className="flex items-center gap-2 text-xs text-gray-600">
            <Link href="/" className="hover:text-[#0066FF]">Accueil</Link>
            <span>/</span>
            <Link href="/realisations" className="hover:text-[#0066FF]">Réalisations</Link>
            <span>/</span>
            <span className="max-w-[200px] truncate text-gray-900">{project.title}</span>
          </nav>
        </div>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              {/* 👇 NOUVEAU : Affichage du Statut et Catégorie côte à côte 👇 */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-md ${styles.badge}`}>
                  {catLabel}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${
                  isEnCours ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  {isEnCours ? '🚧 En cours' : '✅ Terminé'}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt size={12} /> {project.location}</span>
                <span className="flex items-center gap-1.5"><FaCalendarAlt size={12} /> {project.year}</span>
                <span className="flex items-center gap-1.5">👤 {project.client}</span>
              </div>
              <p className="leading-relaxed text-gray-700">{project.shortDesc}</p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-[#0066FF]/10">
              <ProjectCarousel images={project.images} alt={project.title} />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-red-600">🎯 Défi</h4>
                <p className="text-sm leading-relaxed text-gray-700">{project.challenge}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">💡 Solution</h4>
                <p className="text-sm leading-relaxed text-gray-700">{project.solution}</p>
              </div>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 p-5">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">✅ Résultat</h4>
              <p className="text-sm leading-relaxed text-gray-700">{project.result}</p>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0066FF]">Points clés du projet</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {project.features.map((f: string) => (
                  <div key={f} className="rounded-lg border border-gray-100 bg-white/70 p-3 text-center backdrop-blur">
                    <FaCheckCircle className="mx-auto mb-1 text-[#00C2FF]" size={14} />
                    <p className="text-xs font-semibold leading-tight text-gray-700">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/devis" className="inline-flex items-center gap-2 rounded-lg bg-[#0066FF] px-6 py-3 font-bold text-white transition hover:bg-[#0052cc]">
                Demander un devis similaire <FaArrowRight size={12} />
              </Link>
              <Link href="/realisations" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white/80 px-6 py-3 font-semibold text-gray-800 backdrop-blur transition hover:bg-white">
                <FaArrowLeft size={12} /> Toutes les réalisations
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}