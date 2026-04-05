'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  // État du formulaire
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    salesCount: '',
    description: '',
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
        if (isMounted) {
          setForm({
            name: product.name || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            salesCount: product.salesCount?.toString() || '',
            description: product.description || '',
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
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Nettoyer l'aperçu image
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');

    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }

    // Validation du type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      setImageFile(null);
      setImagePreview('');
      return;
    }

    // Validation de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('L’image ne doit pas dépasser 5 Mo.');
      setImageFile(null);
      setImagePreview('');
      return;
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
    setCategories((prev) => [...prev, trimmed]);
    setForm((prev) => ({ ...prev, category: trimmed }));
    setShowNewCategory(false);
    setNewCategoryName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.name.trim()) {
      setError('Le nom du produit est requis');
      return;
    }
    const priceValue = parseFloat(form.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Le prix doit être un nombre positif');
      return;
    }
    if (!form.category) {
      setError('Veuillez sélectionner ou ajouter une catégorie');
      return;
    }

    setSaving(true);
    setError('');

    let imagePath = currentImage;

    // Upload de la nouvelle image si fournie
    if (imageFile) {
      try {
        const uploadForm = new FormData();
        uploadForm.append('image', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Erreur lors de l’upload de l’image');
        }
        imagePath = uploadData.path;
      } catch (err: any) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    // Mise à jour du produit
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          price: priceValue,
          image: imagePath,
          category: form.category.trim(),
          salesCount: parseInt(form.salesCount) || 0,
          description: form.description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de la modification');
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
        {/* Image actuelle et upload */}
        <div>
          <label className="block font-medium mb-1">Image actuelle</label>
          {currentImage && (
            <div className="mb-2">
              <Image
                src={currentImage}
                alt="produit"
                width={100}
                height={100}
                className="object-cover rounded border"
              />
            </div>
          )}
          <label className="block font-medium mt-2">Remplacer l’image (optionnel)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Aperçu" className="w-32 h-32 object-cover rounded border" />
            </div>
          )}
        </div>

        {/* Nom */}
        <div>
          <label className="block font-medium mb-1">Nom *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block font-medium mb-1">Prix (FCFA) *</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block font-medium mb-1">Catégorie *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Sélectionnez --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {!showNewCategory ? (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              + Ajouter une nouvelle catégorie
            </button>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la nouvelle catégorie"
                className="border rounded p-1 flex-1"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowNewCategory(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Ventes */}
        <div>
          <label className="block font-medium mb-1">Nombre de ventes</label>
          <input
            type="number"
            name="salesCount"
            value={form.salesCount}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            href="/admin/products"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition text-center"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}