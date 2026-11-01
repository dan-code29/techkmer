import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md my-10">
      <h1 className="text-2xl font-bold mb-6 text-[#050B16]">Ajouter une réalisation</h1>
      <ProjectForm />
    </div>
  );
}