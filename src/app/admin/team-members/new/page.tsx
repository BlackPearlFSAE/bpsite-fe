'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTeamMember() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    seasonId: '',
    departmentId: '',
    parentId: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Fetch seasons and departments for dropdowns
    const fetchData = async () => {
      try {
        const [seasonRes, deptRes] = await Promise.all([
          fetch('/api/seasons'),
          fetch('/api/departments')
        ]);
        const seasonData = await seasonRes.json();
        const deptData = await deptRes.json();
        
        setSeasons(seasonData);
        setDepartments(deptData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  const selectedSeason = seasons.find(s => s.id.toString() === formData.seasonId);
  const availableParents = selectedSeason ? selectedSeason.members : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.seasonId) return alert('Please select a season');
    if (!formData.departmentId) return alert('Please select a department');
    
    setLoading(true);

    try {
      let uploadedImagePath = '';

      // 1. Upload image if exists
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

      // 2. Create team member
      const res = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          ...formData,
          imagePath: uploadedImagePath
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create team member');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error creating team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Add Team Member</h1>
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
          &larr; Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Member Name</label>
            <input
              type="text"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role/Position</label>
            <input
              type="text"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="e.g. Chief Engineer, Aerodynamics Lead"
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
              onChange={(e) => setFormData({...formData, seasonId: e.target.value, parentId: ''})}
            >
              <option value="">Select Season...</option>
              {seasons.map(s => (
                <option key={s.id} value={s.id}>Season {s.year}</option>
              ))}
            </select>
            {seasons.length === 0 && (
              <p className="text-red-400 text-xs mt-1">Please create a season first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <select
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.departmentId}
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
            >
              <option value="">Select Department...</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {departments.length === 0 && (
              <p className="text-red-400 text-xs mt-1">Please create a department first.</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Reports To (Parent)</label>
          <select
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
            value={formData.parentId}
            onChange={(e) => setFormData({...formData, parentId: e.target.value})}
          >
            <option value="">-- None (Root Node) --</option>
            {availableParents.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">If empty, this person will be a Root Node in the Org Chart.</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Member Photo</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-500 text-xs text-center px-2">No Image</span>
              )}
            </div>
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md border border-gray-600 transition">
              <span>Choose File</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || seasons.length === 0 || departments.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Team Member'}
        </button>
      </form>
    </div>
  );
}
