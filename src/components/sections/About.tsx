'use client';

import React, { useState, useEffect } from 'react';

export default function About() {
  const [aboutImage, setAboutImage] = useState('/team_BP15.jpeg');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.about_image) {
          setAboutImage(data.about_image);
        }
      } catch (err) {
        console.error('Failed to fetch about image', err);
      }
    };
    fetchSettings();
  }, []);
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <h2>About <span>Us</span></h2>
            <h3>Driven by Passion, Engineered for Excellence</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We are the BlackPearl Racing Team from King Mongkut's University of Technology Thonburi (KMUTT). 
              Our mission is to design, manufacture, and race high-performance Formula Student vehicles.
            </p>
            <p>
              Combining cutting-edge engineering with relentless dedication, we push the boundaries of motorsport innovation. 
              Our team consists of passionate students from various engineering disciplines working together to achieve victory on the track.
            </p>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="BlackPearl Team" />
          </div>
        </div>
      </div>
    </section>
  );
}
