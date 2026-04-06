'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    salesCount: '',
    description: '',
    isPromotion: false,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageError, setImageError] = useState('');

  // Charger le produit et les catégories
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [productRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch('/api/categories'),
        ]);
        if (!productRes.ok) throw new Error('Produit non trouvé');
        const product = await productRes.json();
        const cats = await catRes.json();

        console.log('🔍 Produit chargé depuis API:', product);
        console.log('🔍 isPromotion valeur brute:', product.isPromotion, 'type:', typeof product.isPromotion);

        if (isMounted) {
          setForm({
            name: product.name || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            salesCount: product.salesCount?.toString() || '',
            description: product.description || '',
            isPromotion: product.isPromotion === 1,
          });
          setCurrentImage(product.image || '');
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, isPromotion: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) { setImageFile(null); setImagePreview(''); return; }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      setImageFile(null); setImagePreview(''); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('L’image ne doit pas dépasser 5 Mo.');
      setImageFile(null); setImagePreview(''); return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setError('Cette catégorie existe déjà');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    setForm(prev => ({ ...prev, category: trimmed }));
    setShowNewCategory(false);
    setNewCategoryName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) { setError('Le nom est requis'); return; }
    const priceValue = parseFloat(form.price);
    if (isNaN(priceValue) || priceValue <= 0) { setError('Prix invalide'); return; }
    if (!form.category) { setError('Catégorie requise'); return; }

    setSaving(true);
    setError('');

    let imagePath = currentImage;
    if (imageFile) {
      try {
        const uploadForm = new FormData();
        uploadForm.append('image', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Erreur upload');
        imagePath = uploadData.path;
      } catch (err: any) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    const payload = {
      name: form.name.trim(),
      price: priceValue,
      image: imagePath,
      category: form.category.trim(),
      salesCount: parseInt(form.salesCount) || 0,
      description: form.description.trim(),
      isPromotion: form.isPromotion,
    };
    console.log('📤 Payload envoyé à PUT:', payload);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('📥 Réponse API PUT:', data);
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      router.push('/admin/products');
    } catch (err: any) {
      console.error('❌ Erreur lors de la modification:', err);
      setError(err.message || 'Erreur modification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (error && !loading) return <div className="p-8 text-red-600 text-center">Erreur : {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Image actuelle</label>
          {currentImage && (
            <div className="mb-2">
              <Image src={currentImage} alt="produit" width={100} height={100} className="object-cover rounded border" />
            </div>
          )}
          <label className="block font-medium mt-2">Remplacer l’image (optionnel)</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="w-full border rounded p-2" />
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-2 w-32 h-32 object-cover rounded border" />}
        </div>

        <div>
          <label className="block font-medium mb-1">Nom *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium mb-1">Prix (FCFA) *</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium mb-1">Catégorie *</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">-- Sélectionnez --</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {!showNewCategory ? (
            <button type="button" onClick={() => setShowNewCategory(true)} className="text-blue-600 text-sm mt-1 hover:underline">+ Ajouter une nouvelle catégorie</button>
          ) : (
            <div className="mt-2 flex gap-2">
              <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nom" className="border rounded p-1 flex-1" />
              <button type="button" onClick={handleAddNewCategory} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Ajouter</button>
              <button type="button" onClick={() => setShowNewCategory(false)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Annuler</button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Nombre de ventes</label>
          <input type="number" name="salesCount" value={form.salesCount} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPromotion} onChange={handlePromotionChange} className="w-4 h-4" />
            <span className="font-medium">Mettre ce produit en promotion (apparaîtra dans le carrousel)</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">État actuel : {form.isPromotion ? '✅ coché' : '❌ non coché'}</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link href="/admin/products" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Annuler</Link>
        </div>
      </form>
    </div>
  );
}