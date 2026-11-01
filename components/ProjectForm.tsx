'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaUpload } from 'react-icons/fa';

const CATEGORIES = ['securite', 'solaire', 'reseau', 'domotique', 'electricite', 'automatisation', 'maintenance'];

// initialData: si présent, c'est qu'on est en mode "Modification"
// id: l'ID du projet à modifier
export default function ProjectForm({ initialData = null, id = null }: { initialData?: any, id?: string | null }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [files, setFiles] = useState<File[]>([]);
  // On garde les images existantes + les nouvelles
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || []);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'securite',
    status: initialData?.status || 'termine', // 👈 NOUVEAU
    date: initialData?.date || '2026-01',
    year: initialData?.year || '2026',
    location: initialData?.location || '',
    client: initialData?.client || '',
    shortDesc: initialData?.shortDesc || '',
    challenge: initialData?.challenge || '',
    solution: initialData?.solution || '',
    result: initialData?.result || '',
    features: initialData?.features?.join(', ') || '', 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    // Si c'est une nouvelle image, on la retire aussi du tableau des fichiers à uploader
    const existingImagesCount = initialData?.images?.length || 0;
    if (index >= existingImagesCount) {
      setFiles((prev) => prev.filter((_, i) => i !== (index - existingImagesCount)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. On garde les images existantes qui n'ont pas été supprimées
      let finalImages = previewUrls.filter(url => url.startsWith('/images'));
      
      // 2. On upload les nouvelles images
      if (files.length > 0) {
        setUploadingImages(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Erreur lors de l'upload");
        
        finalImages = [...finalImages, ...(uploadData.urls || [])]; 
        setUploadingImages(false);
      }

      // 3. Enregistrement
      const payload = {
        ...form,
        images: finalImages,
        features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      };

      const url = id ? `/api/projects/${id}` : '/api/projects';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(id ? "Réalisation modifiée !" : "Réalisation ajoutée !");
        router.push('/admin/projects'); // Retour à la liste
        router.refresh();
      } else {
        alert("Erreur serveur");
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Titre du projet" required className="border p-2 rounded col-span-2 md:col-span-1" 
          value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        
        <select className="border p-2 rounded col-span-2 md:col-span-1" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="border p-2 rounded font-bold" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="termine">✅ Terminé</option>
          <option value="en_cours">🚧 En cours</option>
        </select>

        <input type="month" required className="border p-2 rounded" 
          value={form.date} onChange={e => setForm({...form, date: e.target.value, year: e.target.value.split('-')[0]})} />
        
        <input type="text" placeholder="Lieu" required className="border p-2 rounded" 
          value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        
        <input type="text" placeholder="Client" className="border p-2 rounded" 
          value={form.client} onChange={e => setForm({...form, client: e.target.value})} />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
        <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#0066FF] text-white px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-blue-700">
          <FaUpload /> Importer des images
        </button>
        
        {previewUrls.length > 0 && (
          <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                <img src={url} alt="Aperçu" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm font-semibold text-[#0066FF] mt-4">{previewUrls.length} image(s)</p>
      </div>

      <textarea placeholder="Description courte" required className="w-full border p-2 rounded h-20" 
        value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} />
      <textarea placeholder="Le Défi" required className="w-full border p-2 rounded h-20" 
        value={form.challenge} onChange={e => setForm({...form, challenge: e.target.value})} />
      <textarea placeholder="La Solution" required className="w-full border p-2 rounded h-20" 
        value={form.solution} onChange={e => setForm({...form, solution: e.target.value})} />
      <textarea placeholder="Le Résultat" required className="w-full border p-2 rounded h-20" 
        value={form.result} onChange={e => setForm({...form, result: e.target.value})} />
      
      <input type="text" placeholder="Points clés (séparés par des virgules)" required className="w-full border p-2 rounded" 
        value={form.features} onChange={e => setForm({...form, features: e.target.value})} />

      <button type="submit" disabled={loading || uploadingImages} className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
        {uploadingImages ? 'Upload...' : loading ? 'Enregistrement...' : id ? 'Enregistrer les modifications' : 'Créer le projet'}
      </button>
    </form>
  );
}