import React from 'react';

interface OrgNodeProps {
  member: any;
}

const OrgNode: React.FC<OrgNodeProps> = ({ member }) => {
  return (
    <li>
      <div className="org-node group">
        <div className="org-node-content bg-gray-900 border-gray-700 group-hover:border-red-500 transition-colors p-0 overflow-hidden flex flex-col h-full w-[180px]">
          <div className="aspect-[4/5] w-full bg-gray-800 relative">
            <img 
              src={member.imagePath || '/placeholder-user.jpg'} 
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {member.department && (
              <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white border border-gray-700">
                {member.department.name}
              </div>
            )}
          </div>
          <div className="p-3 text-center flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-white line-clamp-2">{member.name}</h4>
            <p className="text-xs text-red-400 mt-1 line-clamp-2 font-medium">{member.role}</p>
          </div>
        </div>
      </div>
      
      {/* Recursively render children if they exist */}
      {member.children && member.children.length > 0 && (
        <ul>
          {member.children.map((child: any) => (
            <OrgNode key={child.id} member={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

interface OrgChartProps {
  seasonTitle: string;
  seasonSubtitle?: string;
  rootMembers: any[]; // Now it expects a list of root members (members with no parent)
}

export default function OrgChart({ seasonTitle, seasonSubtitle, rootMembers }: OrgChartProps) {
  return (
    <div className="org-chart-container overflow-x-auto py-12 px-4 hide-scrollbar">
      <div className="org-tree">
        <ul>
          <li>
            {/* Season Header Node */}
            <div className="org-node root-node mb-8">
              <div className="org-node-content bg-red-600 border-red-500 !p-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">{seasonTitle}</h2>
                {seasonSubtitle && <p className="text-red-100 text-sm mt-1">{seasonSubtitle}</p>}
              </div>
            </div>

            {/* Root Members (E.g. Captains / Management) */}
            {rootMembers.length > 0 ? (
              <ul>
                {rootMembers.map(member => (
                  <OrgNode key={member.id} member={member} />
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 mt-8 text-center text-sm">No hierarchy data available</div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
