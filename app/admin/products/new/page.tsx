'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();

  // État du formulaire
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    salesCount: '',
    description: '',
    isPromotion: false,
    promoPrice: '',
  });

  // Liste des catégories existantes
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Gestion des images (plusieurs)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');

  // États généraux
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Chargement des catégories existantes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Erreur chargement catégories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Gestion des champs texte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log('✅ Checkbox cliquée, nouvelle valeur:', checked);
    setForm(prev => {
      const updated = { ...prev, isPromotion: checked };
      console.log('📝 Form state mis à jour:', updated);
      return updated;
    });
  };

  // Gestion de la sélection d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageError('');
    if (files.length === 0) {
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setImageError('Format non supporté. Utilisez JPG, PNG ou WEBP.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Chaque image ne doit pas dépasser 5 Mo.');
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImageFiles(validFiles);
    setImagePreviews(previews);
  };

  // Ajout d'une nouvelle catégorie à la liste
  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setError('Cette catégorie existe déjà');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    setForm(prev => ({ ...prev, category: trimmed }));
    setShowNewCategoryInput(false);
    setNewCategoryName('');
    setError('');
  };

  // Soumission du formulaire
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
    if (imageFiles.length === 0) {
      setError('Veuillez sélectionner au moins une image');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // 1. Upload des images (plusieurs)
      let imagePath = '';
      const uploadedPaths: string[] = [];
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const uploadForm = new FormData();
          uploadForm.append('image', file);
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) {
            throw new Error(uploadData.error || 'Erreur lors de l’upload de l’image');
          }
          return uploadData.path;
        });
        const paths = await Promise.all(uploadPromises);
        uploadedPaths.push(...paths);
        imagePath = uploadedPaths[0] || '';
      }

      // 2. Création du produit
      const productRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          price: priceValue,
          image: imagePath,
          images: uploadedPaths,
          promoPrice: form.promoPrice ? parseFloat(form.promoPrice) : null,
          category: form.category.trim(),
          salesCount: parseInt(form.salesCount) || 0,
          description: form.description.trim(),
          isPromotion: form.isPromotion,
        }),
      });
      const productRes2 = productRes; // Utile pour le logging
      console.log('📤 Payload POST envoyé:', {
        name: form.name.trim(),
        price: priceValue,
        image: imagePath,
        images: uploadedPaths,
        promoPrice: form.promoPrice ? parseFloat(form.promoPrice) : null,
        category: form.category.trim(),
        salesCount: parseInt(form.salesCount) || 0,
        description: form.description.trim(),
        isPromotion: form.isPromotion,
      });
      console.log('✅ isPromotion (boolean):', form.isPromotion, 'sera converti en:', form.isPromotion ? 1 : 0);
      const productData = await productRes2.json();
      if (!productRes.ok) {
        throw new Error(productData.error || 'Erreur lors de la création du produit');
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Une erreur inattendue est survenue');
    } finally {
      setSaving(false);
    }
  };

  // Nettoyer l'aperçu
  useEffect(() => {
    return () => {
      imagePreviews.forEach((p: string) => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Image */}
        <div>
          <label className="block font-medium mb-1">Image du produit *</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            multiple
            className="w-full border rounded p-2"
          />
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {imagePreviews.map((p, idx) => (
                <img key={idx} src={p} alt={`Aperçu ${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
              ))}
            </div>
          )}
        </div>

        {/* Nom */}
        <div>
          <label className="block font-medium mb-1">Nom du produit *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            placeholder="Ex: Perceuse sans fil"
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
            placeholder="0.00"
          />
        </div>

        {/* Prix promotionnel (optionnel) */}
        <div>
          <label className="block font-medium mb-1">Prix promotionnel (FCFA)</label>
          <input
            type="number"
            step="0.01"
            name="promoPrice"
            value={form.promoPrice}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="0.00"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block font-medium mb-1">Catégorie *</label>
          {loadingCategories ? (
            <p className="text-gray-500">Chargement des catégories...</p>
          ) : (
            <>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">-- Sélectionnez une catégorie --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {!showNewCategoryInput ? (
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
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
                    onClick={() => setShowNewCategoryInput(false)}
                    className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Nombre de ventes (optionnel) */}
        <div>
          <label className="block font-medium mb-1">Nombre de ventes (optionnel)</label>
          <input
            type="number"
            name="salesCount"
            value={form.salesCount}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="0"
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
            placeholder="Description détaillée du produit..."
          />
        </div>

        {/* Checkbox promotion */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPromotion}
              onChange={handlePromotionChange}
              className="w-4 h-4"
            />
            <span className="font-medium">Mettre ce produit en promotion (apparaîtra dans le carrousel)</span>
          </label>
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {saving ? 'Création en cours...' : 'Créer le produit'}
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