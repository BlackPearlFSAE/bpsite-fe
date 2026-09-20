'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (!isAuthenticated) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Manage Seasons', desc: 'Add or edit racing seasons', link: '/admin/seasons/new' },
            { title: 'Manage Cars', desc: 'Add new cars and specs', link: '/admin/cars/new' },
            { title: 'Manage Team Members', desc: 'Add, edit, or arrange members', link: '/admin/team-members' },
            { title: 'Manage Departments', desc: 'Edit team departments', link: '/admin/departments/new' },
            { title: 'Manage Sponsors', desc: 'Add sponsor logos and tiers', link: '/admin/sponsors' },
            { title: 'Manage Merch', desc: 'Add or update merchandise', link: '/admin/merch' },
            { title: 'Manage Site Content', desc: 'Update homepage images', link: '/admin/settings' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition cursor-pointer"
              onClick={() => {
                if (item.link !== '#') router.push(item.link);
              }}
            >
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-400 text-sm">{item.desc}</p>
              <div className="mt-4 text-red-500 text-sm font-semibold">Go to page &rarr;</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
