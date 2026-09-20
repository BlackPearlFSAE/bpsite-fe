'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function EditSponsorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seasons, setSeasons] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    tier: '',
    websiteUrl: '',
    seasonId: ''
  });
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const tiers = ['diamond', 'platinum', 'gold', 'silver', 'bronze', 'special'];

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [seasonRes, sponsorRes] = await Promise.all([
          fetch('/api/seasons'),
          fetch(`/api/sponsors/${id}`)
        ]);
        
        if (!sponsorRes.ok) throw new Error('Sponsor not found');
        
        const seasonData = await seasonRes.json();
        const sponsorData = await sponsorRes.json();
        
        setSeasons(seasonData);
        setFormData({
          name: sponsorData.name,
          tier: sponsorData.tier,
          websiteUrl: sponsorData.websiteUrl || '',
          seasonId: sponsorData.seasonId.toString()
        });
        setCurrentImage(sponsorData.logoPath);
        
      } catch (err) {
        console.error('Failed to fetch data', err);
        alert('Failed to load sponsor data.');
        router.push('/admin/sponsors');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedImagePath = currentImage;

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: formDataImage
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        uploadedImagePath = uploadData.url;
      }

      const res = await fetch(`/api/sponsors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          ...formData,
          logoPath: uploadedImagePath
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update sponsor');
      }

      alert('Sponsor updated successfully!');
      router.push('/admin/sponsors');
    } catch (error) {
      console.error(error);
      alert('Error updating sponsor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Sponsor</h1>
        <Link href="/admin/sponsors" className="text-gray-400 hover:text-white">
          &larr; Back to Sponsors
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Name</label>
            <input
              type="text"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
            <input
              type="url"
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Season</label>
            <select
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.seasonId}
              onChange={(e) => setFormData({...formData, seasonId: e.target.value})}
            >
              {seasons.map(s => (
                <option key={s.id} value={s.id}>Season {s.year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
            <select
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500 capitalize"
              value={formData.tier}
              onChange={(e) => setFormData({...formData, tier: e.target.value})}
            >
              {tiers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Logo</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="h-24 w-48 rounded overflow-hidden bg-white border-2 border-dashed border-gray-500 flex items-center justify-center p-2">
              {(imagePreview || currentImage) ? (
                <img src={imagePreview || currentImage!} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <span className="text-gray-500 text-xs text-center">No Image</span>
              )}
            </div>
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md border border-gray-600 transition">
              <span>Change Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default function EditSponsor() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <EditSponsorContent />
    </Suspense>
  );
}
