'use client';

import Link from 'next/link';

export default function MerchComingSoon() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter">
          Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Soon</span>
        </h1>
        
        <div className="h-1 w-24 bg-red-600 mx-auto my-8 rounded"></div>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
          Our official merchandise store is getting ready to launch.
        </p>
        
        <p className="text-gray-500 mb-12">
          Exclusive BlackPearl Racing Team apparel, accessories, and gear will be available here shortly. Stay tuned for the grand opening!
        </p>
        
        <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] uppercase tracking-wider text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
