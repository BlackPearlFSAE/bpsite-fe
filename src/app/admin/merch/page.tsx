'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminMerchComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-black mb-2 uppercase tracking-wide">Coming <span className="text-red-600">Soon</span></h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The Merchandise Management system is currently under development. You will be able to add, edit, and track shop items here soon.
        </p>

        <button 
          onClick={() => router.back()}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
