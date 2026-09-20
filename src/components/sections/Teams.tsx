'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import OrgChart from '../ui/OrgChart';

export default function Teams() {
  const [latestSeason, setLatestSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestSeasonTeam = async () => {
      try {
        const res = await fetch('/api/seasons');
        const seasons = await res.json();
        if (seasons && seasons.length > 0) {
          setLatestSeason(seasons[0]);
        }
      } catch (err) {
        console.error('Failed to fetch teams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestSeasonTeam();
  }, []);

  const members = latestSeason?.members || [];
  
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
  
  const rootMembers = buildTree(members);

  return (
    <section id="teams" className="section teams-section relative overflow-hidden">
      <div className="container">
        
        <div className="flex justify-between items-end mb-8">
          <div className="section-header !mb-0 text-left">
            <h2>The <span>Team</span></h2>
            <p>Meet the minds behind the {latestSeason ? latestSeason.year : 'latest'} machines</p>
          </div>
        </div>
        
        {loading ? (
          <div className="text-gray-400 py-12 text-center">Loading team...</div>
        ) : members.length === 0 ? (
          <div className="text-gray-400 py-12 text-center">No team members available for the current season.</div>
        ) : (
          <OrgChart 
            seasonTitle={`BP-${latestSeason.year % 100}`}
            seasonSubtitle={`${latestSeason.year} Team`}
            rootMembers={rootMembers} 
          />
        )}
        
        {latestSeason && (
          <div className="text-center mt-8">
            <Link 
              href={`/team?seasonId=${latestSeason.id}`}
              className="inline-block border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 font-bold rounded transition"
            >
              View Full Team Organization
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
