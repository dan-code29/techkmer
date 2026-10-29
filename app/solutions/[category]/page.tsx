/* ================================================================== */
/*  APP/SOLUTIONS/[CATEGORY]/PAGE.TSX                                  */
/*  ------------------------------------------------------------------ */
/*  Route dynamique qui gère les 5 pages de détail des solutions.      */
/*  Elle remplace les 5 anciennes pages statiques                      */
/*  (app/solutions/{electrical,connectivity,...}/page.tsx).            */
/*                                                                     */
/*  💡 Grâce à generateStaticParams, les 5 pages sont générées          */
/*  statiquement au build (même performances qu'avant).                */
/* ================================================================== */

import { notFound } from 'next/navigation';
import { SOLUTIONS, getSolutionBySlug, getAllSolutionSlugs } from '@/lib/solutions';
import SolutionDetail from '@/components/SolutionDetail';

/* ------------------------------------------------------------------ */
/*  GÉNÉRATION STATIQUE DES 5 PAGES                                   */
/*  → /solutions/electrical, /solutions/connectivity, etc.             */
/* ------------------------------------------------------------------ */
export async function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ category: slug }));
}

/* ------------------------------------------------------------------ */
/*  MÉTADONNÉES SEO DYNAMIQUES                                         */
/* ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const solution = getSolutionBySlug(category);

  if (!solution) {
    return { title: 'Solution introuvable | CHEFFBUILD' };
  }

  return {
    title: `${solution.name} — ${solution.tagline} | CHEFFBUILD`,
    description: solution.shortDesc,
  };
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default async function SolutionCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const solution = getSolutionBySlug(category);

  // Si le slug ne correspond à aucune solution → 404
  if (!solution) {
    notFound();
  }

  return <SolutionDetail solution={solution} />;
}