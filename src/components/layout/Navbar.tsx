'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch cars and seasons for the dropdowns
    const fetchData = async () => {
      try {
        const [carsRes, seasonsRes] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_URL + '/cars'),
          fetch(process.env.NEXT_PUBLIC_API_URL + '/seasons')
        ]);
        const carsData = await carsRes.json();
        const seasonsData = await seasonsRes.json();
        
        setCars(carsData);
        setSeasons(seasonsData);
      } catch (err) {
        console.error('Failed to fetch data for navbar');
      }
    };
    fetchData();
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="logo">
          BLACK<span>PEARL</span>
        </Link>
        <div className="nav-links">
          <Link href="/#about">ABOUT</Link>
          
          <div className="dropdown">
            <button className="dropbtn" onClick={(e) => {
              // On mobile or click, we could toggle a class, but hover works on desktop.
              // We'll let CSS handle hover, but add a simple link to a cars listing if we had one.
              // For now, it just acts as a hover trigger.
            }}>
              CARS <span>▼</span>
            </button>
            <div className="dropdown-content">
              {cars.length > 0 ? (
                cars.map(car => (
                  <Link key={car.id} href={`/car?id=${car.id}`}>
                    {car.season?.year || car.name} ({car.name})
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">No cars available</div>
              )}
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">
              TEAMS <span>▼</span>
            </button>
            <div className="dropdown-content">
              {seasons.length > 0 ? (
                seasons.map((season) => (
                  <Link key={season.id} href={`/team?seasonId=${season.id}`}>
                    Season {season.year}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">No teams</div>
              )}
            </div>
          </div>
          
          <div className="dropdown">
            <button className="dropbtn">
              SPONSORS <span>▼</span>
            </button>
            <div className="dropdown-content">
              {seasons.length > 0 ? (
                seasons.map((season) => (
                  <Link key={season.id} href={`/?sponsorSeasonId=${season.id}#sponsor`}>
                    Season {season.year}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">No sponsors</div>
              )}
            </div>
          </div>
          <Link href="/merch">SHOP</Link>
          
          <div className="dropdown">
            <button className="dropbtn">
              TH <span>▼</span>
            </button>
            <div className="dropdown-content min-w-fit">
              <a href="#">TH</a>
              <a href="#">EN</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
