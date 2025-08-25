import React from 'react';
import type { Correction } from '../types';

interface CorrectionModalProps {
  correction: Correction | null;
  onClose: () => void;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({ correction, onClose }) => {
  if (!correction) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-700 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Grammar Tip</h2>
        
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-400 text-sm mb-1 uppercase tracking-wider">Your Sentence:</h3>
            <p className="p-3 bg-gray-900/50 rounded-md text-red-300 italic">
              {correction.original}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-400 text-sm mb-1 uppercase tracking-wider">Suggestion:</h3>
            <p className="p-3 bg-gray-900/50 rounded-md text-green-300">
              {correction.corrected}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-400 text-sm mb-1 uppercase tracking-wider">Explanation:</h3>
            <p className="p-3 bg-gray-700 rounded-md">
              {correction.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionModal;
