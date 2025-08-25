import React from 'react';
import type { Mission } from '../types';
import { SUPPORTED_MISSIONS } from '../constants';

interface MissionSelectorProps {
  onMissionSelect: (mission: Mission) => void;
  languageName: string;
}

const MissionCard: React.FC<{ mission: Mission; onSelect: () => void }> = ({ mission, onSelect }) => (
  <button
    onClick={onSelect}
    className="group w-full text-left p-6 bg-gray-700/50 border border-gray-600 rounded-xl hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
  >
    <h3 className="text-xl font-semibold text-amber-300 group-hover:text-amber-200">{mission.title}</h3>
    <p className="text-gray-400 mt-2">{mission.description}</p>
  </button>
);

export const MissionSelector: React.FC<MissionSelectorProps> = ({ onMissionSelect, languageName }) => {
  return (
    <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Choose a Mission</h1>
      <p className="text-gray-400 mb-8">
        Practice your {languageName} in a real-world scenario.
      </p>
      <div className="space-y-4">
        {SUPPORTED_MISSIONS.map((mission) => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            onSelect={() => onMissionSelect(mission)} 
          />
        ))}
      </div>
    </div>
  );
};
