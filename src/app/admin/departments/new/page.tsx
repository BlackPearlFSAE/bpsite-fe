'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDepartment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to create department');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error creating department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Department</h1>
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
          &larr; Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Department Name</label>
          <input
            type="text"
            required
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Powertrain, Aerodynamics, Management"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            required
            rows={4}
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the department's role..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Department'}
        </button>
      </form>
    </div>
  );
}
