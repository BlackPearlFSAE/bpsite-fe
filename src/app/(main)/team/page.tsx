'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OrgChart from '@/components/ui/OrgChart';

function TeamDetailsContent() {
  const searchParams = useSearchParams();
  const seasonId = searchParams.get('seasonId');

  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        let url = process.env.NEXT_PUBLIC_API_URL + '/seasons';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch seasons');
        const seasons = await res.json();
        
        if (seasons.length === 0) {
          setError('No seasons found.');
          setLoading(false);
          return;
        }

        let targetSeason = seasons[0];
        if (seasonId) {
          const found = seasons.find((s: any) => s.id.toString() === seasonId);
          if (found) targetSeason = found;
          else throw new Error('Season not found');
        }
        
        setSeason(targetSeason);
      } catch (err: any) {
        setError(err.message || 'Failed to load team details');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [seasonId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !season) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <Link href="/" className="px-6 py-2 bg-red-600 rounded">Go Home</Link>
      </div>
    );
  }

  // Build recursive tree from flat members list
  const buildTree = (members: any[]) => {
    const memberMap: Record<number, any> = {};
    const rootNodes: any[] = [];

    // Initialize map
    members.forEach(member => {
      memberMap[member.id] = { ...member, children: [] };
    });

    // Build tree
    members.forEach(member => {
      if (member.parentId) {
        if (memberMap[member.parentId]) {
          memberMap[member.parentId].children.push(memberMap[member.id]);
        } else {
          rootNodes.push(memberMap[member.id]);
        }
      } else {
        rootNodes.push(memberMap[member.id]);
      }
    });
    
    return rootNodes;
  };

  const rootMembers = season.members ? buildTree(season.members) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black mb-4">Team <span>Structure</span></h1>
          <p className="text-2xl text-gray-400">Season {season.year} {season.theme ? `- ${season.theme}` : ''}</p>
        </div>

        {rootMembers.length > 0 ? (
          <OrgChart 
            seasonTitle={`Season ${season.year}`}
            seasonSubtitle="Team Organization"
            rootMembers={rootMembers} 
          />
        ) : (
          <div className="text-center py-20 text-gray-500">
            No team members listed for this season yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <TeamDetailsContent />
    </Suspense>
  );
}
