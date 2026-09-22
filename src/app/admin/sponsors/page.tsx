'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SponsorsList() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/sponsors');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSponsors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (res.ok) {
        setSponsors(sponsors.filter(s => s.id !== id));
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
        <h1 className="text-3xl font-bold">Manage Sponsors</h1>
        <div className="flex gap-4">
          <Link href="/admin/sponsors/new" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">
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
              <th className="p-4 font-semibold">Sponsor Name</th>
              <th className="p-4 font-semibold">Tier</th>
              <th className="p-4 font-semibold">Season</th>
              <th className="p-4 font-semibold">Website</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map(sponsor => (
              <tr key={sponsor.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4 font-bold flex items-center gap-3">
                  {sponsor.logoPath ? (
                    <img src={sponsor.logoPath} alt="" className="w-12 h-8 object-contain bg-white rounded p-1" />
                  ) : (
                    <div className="w-12 h-8 bg-gray-600 rounded"></div>
                  )}
                  {sponsor.name}
                </td>
                <td className="p-4 text-gray-300 capitalize">{sponsor.tier}</td>
                <td className="p-4 text-gray-300">Season {sponsor.season?.year}</td>
                <td className="p-4 text-blue-400">
                  {sponsor.websiteUrl ? (
                    <a href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className="hover:underline text-sm">
                      Visit Site
                    </a>
                  ) : '-'}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/sponsors/edit?id=${sponsor.id}`} className="text-blue-400 hover:text-blue-300 mr-4">Edit</Link>
                  <button onClick={() => handleDelete(sponsor.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No sponsors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
