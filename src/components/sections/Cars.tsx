'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Cars() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();
        // Assuming data is an array of cars
        setCars(data);
      } catch (err) {
        console.error('Failed to fetch cars', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -370, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  return (
    <section id="cars" className="section relative overflow-hidden">
      <div className="container">
        <div className="flex justify-between items-end mb-8">
          <div className="section-header !mb-0">
            <h2>Our <span>Cars</span></h2>
            <p>The evolution of speed and engineering</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
            >
              &larr;
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
            >
              &rarr;
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-gray-400 py-12">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="text-gray-400 py-12">No cars available yet.</div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cars.map(car => {
              let imagePaths = [];
              try { imagePaths = JSON.parse(car.imagePaths || '[]'); } catch (e) {}
              const mainImage = imagePaths.length > 0 ? imagePaths[0] : '/placeholder.jpg';
              
              return (
                <div 
                  className="card snap-start shrink-0 w-[350px] sm:w-[400px] flex flex-col" 
                  key={car.id}
                >
                  <Link href={`/car?id=${car.id}`} className="block h-full group">
                    <div className="card-image overflow-hidden aspect-[16/10]">
                      <img 
                        src={mainImage} 
                        alt={car.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="card-content flex-1 flex flex-col">
                      <div>
                        <span className={`badge ${car.category === 'Electric' ? 'yellow' : 'orange'}`}>
                          {car.category}
                        </span>
                      </div>
                      <h3 className="mt-2 mb-2 group-hover:text-red-500 transition-colors">
                        {car.name} {car.season?.year ? `(${car.season.year})` : ''}
                      </h3>
                      <p className="line-clamp-3 text-sm text-gray-400 flex-1">
                        {car.description || `Explore the specifications and design of the ${car.name}.`}
                      </p>
                      <div className="mt-4 text-red-500 font-semibold text-sm">
                        View Details &rarr;
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
