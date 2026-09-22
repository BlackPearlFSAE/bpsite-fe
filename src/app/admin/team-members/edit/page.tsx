'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function EditTeamMemberContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [seasons, setSeasons] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    seasonId: '',
    departmentId: '',
    parentId: ''
  });
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seasonRes, deptRes, memberRes] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_URL + '/seasons'),
          fetch(process.env.NEXT_PUBLIC_API_URL + '/departments'),
          fetch(`/api/team-members/${id}`)
        ]);
        
        if (!memberRes.ok) throw new Error('Member not found');
        
        const seasonData = await seasonRes.json();
        const deptData = await deptRes.json();
        const memberData = await memberRes.json();
        
        setSeasons(seasonData);
        setDepartments(deptData);
        
        setFormData({
          name: memberData.name,
          role: memberData.role,
          seasonId: memberData.seasonId.toString(),
          departmentId: memberData.departmentId.toString(),
          parentId: memberData.parentId ? memberData.parentId.toString() : ''
        });
        setCurrentImage(memberData.imagePath);
        
      } catch (err) {
        console.error('Failed to fetch data', err);
        alert('Failed to load member data.');
        router.push('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const selectedSeason = seasons.find(s => s.id.toString() === formData.seasonId);
  const availableParents = selectedSeason ? selectedSeason.members.filter((m: any) => m.id.toString() !== id) : [];

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
        
        const uploadRes = await fetch(process.env.NEXT_PUBLIC_API_URL + '/upload', {
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

      const res = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update team member');
      }

      alert('Team member updated successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error updating team member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Team Member</h1>
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
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role/Position</label>
            <input
              type="text"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
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
              {seasons.map(s => (
                <option key={s.id} value={s.id}>Season {s.year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
            <select
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-red-500"
              value={formData.departmentId}
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
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
          <p className="text-gray-400 text-xs mt-1">Select the person this member reports to.</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Member Photo</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center">
              {(imagePreview || currentImage) ? (
                <img src={imagePreview || currentImage!} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-500 text-xs text-center px-2">No Image</span>
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

export default function EditTeamMember() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <EditTeamMemberContent />
    </Suspense>
  );
}
