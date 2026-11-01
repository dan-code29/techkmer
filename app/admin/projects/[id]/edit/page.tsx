import { turso } from '@/lib/turso';
import ProjectForm from '@/components/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await turso.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
  
  if (result.rows.length === 0) notFound();
  
  const raw = result.rows[0];
  const initialData = {
    ...raw,
    id: Number(raw.id),
    images: JSON.parse(raw.images as string || '[]'),
    features: JSON.parse(raw.features as string || '[]'),
    shortDesc: raw.short_desc,
    status: raw.status || 'termine'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md my-10">
      <h1 className="text-2xl font-bold mb-6 text-[#050B16]">Modifier la réalisation</h1>
      <ProjectForm initialData={initialData} id={id} />
    </div>
  );
}