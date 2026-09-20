'use client';

import React, { useState, useEffect } from 'react';

const DEFAULT_IMAGES = [
  '/IMG_0495.JPG',
  '/team_BP15.jpeg',
  '/team_BP14.jpg',
  '/team_BP9.jpg'
];

export default function Hero() {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.hero_images) {
          const parsed = JSON.parse(data.hero_images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImages(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero images', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="hero">
      <div className="hero-slider">
        {images.map((img, index) => (
          <div
            key={img}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      <div className="overlay"></div>
      
      <div className="hero-content">
        <h1>BLACK<span>PEARL</span></h1>
        <p>KMUTT Formula Student Racing Team</p>
        <a href="#about" className="cta-button">DISCOVER MORE</a>
      </div>

      <a href="#about" className="scroll-down">
        SCROLL
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </a>
    </section>
  );
}
