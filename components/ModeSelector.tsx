import React from 'react';
import { ChatMode } from '../types';

interface ModeSelectorProps {
  onModeSelect: (mode: ChatMode) => void;
  languageName: string;
}

const ImmersionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);
  
const CrosstalkIcon: React.FC = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const MissionsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6" />
    </svg>
);


export const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect, languageName }) => {
  return (
    <div className="w-full max-w-6xl p-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Let's Learn {languageName}!</h1>
      <p className="text-gray-400 mb-8">Choose your practice mode:</p>
      <div className="grid md:grid-cols-3 gap-8">
        <button
          onClick={() => onModeSelect(ChatMode.IMMERSION)}
          className="group flex flex-col items-center p-8 bg-gray-700/50 border border-teal-500/30 rounded-xl hover:bg-teal-500/10 hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <ImmersionIcon />
          <h2 className="text-2xl font-semibold text-teal-300 mt-4">Immersion</h2>
          <p className="text-gray-400 mt-2">
            You and the AI chat exclusively in <span className="font-bold">{languageName}</span>. Perfect for practicing your skills.
          </p>
        </button>

        <button
          onClick={() => onModeSelect(ChatMode.CROSSTALK)}
          className="group flex flex-col items-center p-8 bg-gray-700/50 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <CrosstalkIcon />
          <h2 className="text-2xl font-semibold text-purple-300 mt-4">Crosstalk</h2>
          <p className="text-gray-400 mt-2">
            You chat in English, and the AI responds in <span className="font-bold">{languageName}</span>. Great for beginners.
          </p>
        </button>

        <button
          onClick={() => onModeSelect(ChatMode.MISSIONS)}
          className="group flex flex-col items-center p-8 bg-gray-700/50 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <MissionsIcon />
          <h2 className="text-2xl font-semibold text-amber-300 mt-4">Missions</h2>
          <p className="text-gray-400 mt-2">
            Complete real-world tasks through role-playing scenarios in <span className="font-bold">{languageName}</span>.
          </p>
        </button>
      </div>
    </div>
  );
};
