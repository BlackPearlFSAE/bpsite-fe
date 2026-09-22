'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [aboutImage, setAboutImage] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/settings', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        
        if (data.hero_images) {
          try { setHeroImages(JSON.parse(data.hero_images)); } catch (e) {}
        }
        if (data.about_image) {
          setAboutImage(data.about_image);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', files[0]);
      
      const uploadRes = await fetch(process.env.NEXT_PUBLIC_API_URL + '/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const data = await uploadRes.json();
      
      if (isHero) {
        setHeroImages(prev => [...prev, data.url]);
      } else {
        setAboutImage(data.url);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save Hero Images
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ key: 'hero_images', value: JSON.stringify(heroImages) })
      });

      // Save About Image
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ key: 'about_image', value: aboutImage })
      });

      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Site Content</h1>
        <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition">
          Back to Dashboard
        </Link>
      </div>

      {/* Hero Section Settings */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-red-500">Hero Section Slider</h2>
        <p className="text-gray-400 mb-4 text-sm">Add images to slide in the homepage background.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {heroImages.map((img, idx) => (
            <div key={idx} className="relative group rounded overflow-hidden bg-gray-900 border border-gray-600 aspect-video">
              <img src={img} alt={`Hero ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeHeroImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
          
          <label className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded aspect-video cursor-pointer hover:border-gray-400 transition bg-gray-900">
            <span className="text-gray-400">+ Add Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(e, true)} disabled={saving} />
          </label>
        </div>
      </div>

      {/* About Section Settings */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-red-500">About Us Image</h2>
        <p className="text-gray-400 mb-4 text-sm">The single image displayed next to the About Us text.</p>
        
        <div className="flex items-center gap-6">
          <div className="relative rounded overflow-hidden bg-gray-900 border border-gray-600 aspect-video w-64 h-36">
            {aboutImage ? (
              <img src={aboutImage} alt="About Us" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
            )}
          </div>
          
          <label className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer transition">
            <span>Upload New Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(e, false)} disabled={saving} />
          </label>
        </div>
      </div>

      <button 
        onClick={handleSaveSettings}
        disabled={saving}
        className="w-full bg-red-600 hover:bg-red-700 py-4 font-bold text-lg rounded transition disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>

    </div>
  );
}
