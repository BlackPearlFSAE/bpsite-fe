'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Define standard tiers and their display properties
const TIER_CONFIG = [
  { id: 'diamond', label: 'Diamond Sponsors', logoSize: 'w-64 h-32' },
  { id: 'special', label: 'Special Sponsors', logoSize: 'w-56 h-28' },
  { id: 'platinum', label: 'Platinum Sponsors', logoSize: 'w-56 h-28' },
  { id: 'gold', label: 'Gold Sponsors', logoSize: 'w-48 h-24' },
  { id: 'silver', label: 'Silver Sponsors', logoSize: 'w-40 h-20' },
  { id: 'bronze', label: 'Bronze Sponsors', logoSize: 'w-32 h-16' },
];

function SponsorsContent() {
  const searchParams = useSearchParams();
  const sponsorSeasonIdParam = searchParams.get('sponsorSeasonId');
  
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch('/api/seasons');
        const data = await res.json();
        setSeasons(data.sort((a: any, b: any) => b.year - a.year)); // Newest first
        if (sponsorSeasonIdParam) {
          setSelectedSeasonId(sponsorSeasonIdParam);
        } else if (data.length > 0) {
          setSelectedSeasonId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch seasons for sponsors', err);
      }
    };
    fetchSeasons();
  }, [sponsorSeasonIdParam]);

  const selectedSeason = seasons.find(s => s.id.toString() === selectedSeasonId);
  const sponsors = selectedSeason?.sponsors || [];

  // Group sponsors by tier
  const sponsorsByTier: Record<string, any[]> = {};
  sponsors.forEach((sponsor: any) => {
    if (!sponsorsByTier[sponsor.tier]) {
      sponsorsByTier[sponsor.tier] = [];
    }
    sponsorsByTier[sponsor.tier].push(sponsor);
  });

  return (
    <section id="sponsor" className="section relative bg-gray-950 py-24">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container relative z-10 mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-gray-800 pb-8">
          <div className="section-header text-left mb-0">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-2">Our <span className="text-red-600">Sponsors</span></h2>
            <p className="text-gray-400 text-lg">Season {selectedSeason?.year || ''}</p>
          </div>
        </div>
        
        {/* Sponsors Display */}
        {sponsors.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            <p className="text-xl">No sponsors listed for this season yet.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {TIER_CONFIG.map(tier => {
              const tierSponsors = sponsorsByTier[tier.id];
              // Only render this tier if it has sponsors
              if (!tierSponsors || tierSponsors.length === 0) return null;

              return (
                <div key={tier.id} className="sponsor-tier-group">
                  <h3 className="text-center text-xl md:text-2xl font-bold text-gray-400 uppercase tracking-widest mb-10 pb-4 relative inline-block left-1/2 -translate-x-1/2">
                    {tier.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-600 rounded"></span>
                  </h3>
                  
                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {tierSponsors.map(sponsor => {
                      // Sponsor Item Content
                      const content = (
                        <div className={`
                          ${tier.logoSize} bg-white rounded-xl shadow-lg p-6 
                          flex items-center justify-center transition-all duration-300
                          hover:shadow-red-500/20 hover:shadow-2xl hover:-translate-y-2 group
                          border border-gray-100
                        `}>
                          {sponsor.logoPath ? (
                            <img 
                              src={sponsor.logoPath} 
                              alt={sponsor.name}
                              className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <span className="font-black text-gray-400 group-hover:text-gray-900 transition-colors uppercase text-center w-full truncate">
                              {sponsor.name}
                            </span>
                          )}
                        </div>
                      );

                      // Wrap in anchor if websiteUrl exists
                      if (sponsor.websiteUrl) {
                        return (
                          <a 
                            key={sponsor.id} 
                            href={sponsor.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                            title={`Visit ${sponsor.name}`}
                          >
                            {content}
                          </a>
                        );
                      }
                      
                      return <div key={sponsor.id}>{content}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Sponsors() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-white">Loading sponsors...</div>}>
      <SponsorsContent />
    </Suspense>
  );
}
