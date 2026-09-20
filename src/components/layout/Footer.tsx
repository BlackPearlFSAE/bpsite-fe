import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div className="logo">
              BLACK<span>PEARL</span>
            </div>
            <p>KMUTT Formula Student Racing Team. Driven by passion, engineered for excellence.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="#about">About Us</Link>
            <Link href="#cars">Our Cars</Link>
            <Link href="#teams">The Team</Link>
            <Link href="#sponsor">Sponsors</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>King Mongkut's University of Technology Thonburi</p>
            <p>126 Pracha Uthit Rd, Bang Mod, Thung Khru, Bangkok 10140</p>
            <p>blackpearl.kmutt@gmail.com</p>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/blackpearlracing/" target="_blank" rel="noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BlackPearl Racing Team KMUTT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
