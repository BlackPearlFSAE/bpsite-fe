'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSeasonPage() {
  const router = useRouter();
  
  const [year, setYear] = useState('');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/seasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          year: Number(year),
          theme
        })
      });

      if (!res.ok) throw new Error('Failed to save season');
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-500 mb-8">Add New Season</h1>
        
        {error && <div className="bg-red-500/20 text-red-500 p-4 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Year (e.g., 2024)</label>
            <input 
              type="number" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:border-red-500 border border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Theme / Slogan (Optional)</label>
            <input 
              type="text" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)} 
              className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:border-red-500 border border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
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
              {loading ? 'Saving...' : 'Save Season'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
