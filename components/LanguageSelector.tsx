
import React, { useState } from 'react';
import type { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const GlobeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053-.053a.5.5 0 01.707 0l1.414 1.414a.5.5 0 010 .707l-1.414 1.414a.5.5 0 01-.707 0l-.053-.053A4.5 4.5 0 007.707 4.5zM12 12a4.5 4.5 0 004.5 4.5h.393a.5.5 0 00.493-.447l.545-3.272a.5.5 0 00-.493-.553h-.393A4.5 4.5 0 0012 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const [selectedLangCode, setSelectedLangCode] = useState<string>(SUPPORTED_LANGUAGES[0].code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLangCode);
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl text-center transition-all">
        <GlobeIcon />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to LingoBuddy!</h1>
        <p className="text-gray-400 mb-6">Your personal AI language tutor.</p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="language" className="text-lg font-medium text-gray-300">
            Select a language to learn:
          </label>
          <select
            id="language"
            value={selectedLangCode}
            onChange={(e) => setSelectedLangCode(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
};
