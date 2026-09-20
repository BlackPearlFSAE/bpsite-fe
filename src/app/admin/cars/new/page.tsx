'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function AddCarPage() {
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Combustion');
  const [seasonId, setSeasonId] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Specs State
  const [specs, setSpecs] = useState([{ name: '', value: '' }]);
  
  // Meta State
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch seasons for dropdown
    const fetchSeasons = async () => {
      try {
        const res = await fetch('/api/seasons');
        const data = await res.json();
        setSeasons(data);
        if (data.length > 0) setSeasonId(data[0].id.toString());
      } catch (err) {
        console.error('Failed to fetch seasons');
      }
    };
    fetchSeasons();
  }, []);

  const handleAddSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('admin_token');
    if (!token) {
      setError('Unauthorized. Please login again.');
      setLoading(false);
      return;
    }

    try {
      // 1. Upload Image
      let imagePaths = '[]';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        // Schema expects JSON string for imagePaths
        imagePaths = JSON.stringify([uploadData.url]); 
      }

      // 2. Prepare JSON for Specs
      // Filter out empty specs
      const validSpecs = specs.filter(s => s.name.trim() !== '' && s.value.trim() !== '');
      const specsJson = JSON.stringify(validSpecs);

      // 3. Save Car
      const carRes = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          category,
          seasonId,
          description,
          specs: specsJson,
          imagePaths
        })
      });

      if (!carRes.ok) throw new Error('Failed to save car');
      
      // Success
      router.push('/admin/dashboard');

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-8">Add New Car</h1>
        
        {error && <div className="bg-red-500/20 text-red-500 p-4 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Car Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:border-red-500 border border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded focus:outline-none"
                >
                  <option value="Combustion">Combustion</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Season</label>
                {seasons.length > 0 ? (
                  <select 
                    value={seasonId} 
                    onChange={(e) => setSeasonId(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded focus:outline-none"
                    required
                  >
                    {seasons.map(s => (
                      <option key={s.id} value={s.id}>{s.year} - {s.theme}</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded flex flex-col gap-2">
                    <p>No seasons found! You must create a season before adding a car.</p>
                    <button 
                      type="button" 
                      onClick={() => router.push('/admin/seasons/new')}
                      className="text-white bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded w-fit"
                    >
                      Create Season
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
            </div>

            {/* Dynamic Specs */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Specifications</h2>
                <button 
                  type="button" 
                  onClick={handleAddSpec}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                >
                  + Add Spec
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Name (e.g. Speed)" 
                      value={spec.name}
                      onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                      className="flex-1 bg-gray-700 p-2 rounded text-sm focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Value (e.g. 200km/h)" 
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="flex-1 bg-gray-700 p-2 rounded text-sm focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSpec(index)}
                      className="bg-red-600 hover:bg-red-700 px-3 rounded text-white"
                    >
                      X
                    </button>
                  </div>
                ))}
                {specs.length === 0 && <p className="text-gray-500 text-sm">No specs added.</p>}
              </div>
            </div>
          </div>

          {/* Markdown Description */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Description (Markdown)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Editor</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-64 bg-gray-700 p-4 rounded focus:outline-none font-mono text-sm"
                  placeholder="Write description in Markdown..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Preview</label>
                <div className="w-full h-64 bg-gray-900 p-4 rounded overflow-y-auto prose prose-invert max-w-none">
                  <ReactMarkdown>{description || '*Preview will appear here*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
