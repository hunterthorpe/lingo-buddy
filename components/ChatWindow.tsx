import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Correction } from '../types';
import { Role } from '../types';
import CorrectionModal from './CorrectionModal';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onReset: () => void;
  targetLanguageName: string;
  chatMode: string;
  missionTitle?: string;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const LingoBuddyIcon = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 000 1.84L9 9.61V16.5a1 1 0 00.553.894l7 3.5a1 1 0 001.447-.894V9.61l-8.5-4.25z" />
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 000 1.84L9 9.61V16.5a1 1 0 00.553.894l7 3.5a1 1 0 001.447-.894V9.61l-8.5-4.25z" />
        </svg>
    </div>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const TypingIndicator = () => (
    <div className="flex items-center space-x-2">
        <LingoBuddyIcon />
        <div className="flex items-center space-x-1 p-3 bg-gray-700 rounded-lg rounded-bl-none">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onReset, targetLanguageName, chatMode, missionTitle }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeCorrection, setActiveCorrection] = useState<Correction | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
        <div className="w-full max-w-3xl h-[90vh] flex flex-col bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <header className="p-4 bg-gray-900/50 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold">LingoBuddy</h1>
                    <p className="text-sm text-gray-400">
                        {targetLanguageName} - {chatMode} Mode
                        {missionTitle && <span className="font-semibold text-amber-300"> | {missionTitle}</span>}
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                    End Session
                </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-center gap-3 ${msg.role === Role.USER ? 'justify-end' : ''}`}>
                            {msg.role === Role.MODEL && <LingoBuddyIcon />}

                            {msg.role === Role.USER && msg.correction && (
                                <button 
                                    onClick={() => setActiveCorrection(msg.correction)}
                                    className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    aria-label="Show grammar correction"
                                >
                                    <PencilIcon />
                                </button>
                            )}

                            <div className={`p-3 rounded-lg max-w-lg ${msg.role === Role.USER ? 'bg-indigo-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                            </div>
                           
                            {msg.role === Role.USER && <UserIcon />}
                        </div>
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
        <CorrectionModal correction={activeCorrection} onClose={() => setActiveCorrection(null)} />
    </>
  );
};