'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeamMembersList() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/team-members');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Team Members</h1>
        <div className="flex gap-4">
          <Link href="/admin/team-members/new" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">
            + Add New
          </Link>
          <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Season</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Reports To</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4 font-bold flex items-center gap-3">
                  <img src={member.imagePath || '/placeholder-user.jpg'} alt="" className="w-8 h-8 rounded-full object-cover" />
                  {member.name}
                </td>
                <td className="p-4 text-gray-300">{member.role}</td>
                <td className="p-4 text-gray-300">{member.season?.year}</td>
                <td className="p-4 text-gray-300">{member.department?.name}</td>
                <td className="p-4 text-gray-300">{member.parent?.name || <span className="text-gray-500 italic">None (Root)</span>}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/team-members/edit?id=${member.id}`} className="text-blue-400 hover:text-blue-300 mr-4">Edit</Link>
                  <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No team members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
