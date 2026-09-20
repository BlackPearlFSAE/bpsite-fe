'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

function CarDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No car specified');
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) throw new Error('Car not found');
        const data = await res.json();
        setCar(data);
      } catch (err) {
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <Link href="/" className="px-6 py-2 bg-red-600 rounded">Go Home</Link>
      </div>
    );
  }

  // Parse JSON fields
  let specs = [];
  try { specs = JSON.parse(car.specs || '[]'); } catch (e) {}
  
  let imagePaths = [];
  try { imagePaths = JSON.parse(car.imagePaths || '[]'); } catch (e) {}
  
  const mainImage = imagePaths.length > 0 ? imagePaths[0] : '/placeholder.jpg'; // fallback

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-red-600 rounded-full text-sm font-semibold mb-4">
            {car.category}
          </span>
          <h1 className="text-5xl font-black mb-2">{car.name}</h1>
          <p className="text-xl text-gray-400">Season {car.season?.year} - {car.season?.theme}</p>
        </div>

        {/* Main Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-16 shadow-2xl border border-gray-800">
          <img 
            src={mainImage} 
            alt={car.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description (Markdown) */}
          <div className="lg:col-span-2 space-y-6 bg-gray-800 p-8 rounded-xl">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">About the Car</h2>
            <div className="prose prose-invert prose-red max-w-none">
              <ReactMarkdown>{car.description || '*No description provided.*'}</ReactMarkdown>
            </div>
          </div>

          {/* Specs Sidebar */}
          <div className="space-y-6 bg-gray-800 p-8 rounded-xl h-fit">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">Specifications</h2>
            {specs.length > 0 ? (
              <ul className="space-y-4">
                {specs.map((spec: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                    <span className="text-gray-400">{spec.name}</span>
                    <span className="font-semibold text-right">{spec.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No specifications listed.</p>
            )}

            {/* Awards section if any */}
            {car.awards && car.awards.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-yellow-500">Awards</h3>
                <ul className="space-y-3">
                  {car.awards.map((award: any) => (
                    <li key={award.id} className="flex gap-3 items-start">
                      <span className="text-yellow-500 text-xl">🏆</span>
                      <div>
                        <p className="font-semibold">{award.title}</p>
                        <p className="text-sm text-gray-400">{award.event} ({award.year})</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <CarDetailsContent />
    </Suspense>
  );
}
