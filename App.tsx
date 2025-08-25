import React, { useState, useCallback, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { ModeSelector } from './components/ModeSelector';
import { MissionSelector } from './components/MissionSelector';
import { ChatWindow } from './components/ChatWindow';
import type { Language, ChatMessage, Mission } from './types';
import { ChatMode, Role } from './types';

const API_ENDPOINT = 'https://5133u1gex0.execute-api.ap-southeast-2.amazonaws.com/lingoBuddy';

const App: React.FC = () => {
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callLingoBuddyApi = async (newMessage: string, currentHistory: ChatMessage[], lang: Language, mode: ChatMode, mission: Mission | null) => {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newMessage,
                history: currentHistory,
                language: lang,
                mode,
                mission,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
            throw new Error(errorData.error || `API request failed with status: ${response.status}`);
        }

        return response.json();
    } catch (e: any) {
        // This catches network errors (like CORS, DNS failure) that cause fetch to throw a TypeError.
        console.error('Network or fetch error:', e);
        // Re-throw a more user-friendly error for the UI.
        throw new Error(`Could not connect to the LingoBuddy service. Please check your network connection and API configuration. (${e.message})`);
    }
  };

  const initializeChat = useCallback(async (lang: Language, mode: ChatMode, mission: Mission | null) => {
    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const data = await callLingoBuddyApi("Start conversation", [], lang, mode, mission);
      const responseText = data.text;

      let firstMessage: ChatMessage;
      if (mode === ChatMode.CROSSTALK) {
        firstMessage = { role: Role.MODEL, text: responseText };
      } else {
        // Immersion or Mission mode expects a JSON response
        const parsedData = JSON.parse(responseText);
        firstMessage = { role: Role.MODEL, text: parsedData.response, correction: parsedData.correction || null };
      }
      setMessages([firstMessage]);

    } catch (e: any) {
      console.error(e);
      setError(`Failed to initialize chat. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (targetLanguage && chatMode) {
      if (chatMode === ChatMode.MISSIONS) {
        if (selectedMission) {
          initializeChat(targetLanguage, chatMode, selectedMission);
        }
      } else {
        initializeChat(targetLanguage, chatMode, null);
      }
    }
  }, [chatMode, targetLanguage, selectedMission, initializeChat]);

  const handleSendMessage = async (messageText: string) => {
    if (!targetLanguage || !chatMode) {
      setError("Chat is not initialized correctly.");
      return;
    }

    const userMessage: ChatMessage = { role: Role.USER, text: messageText };
    const historyForApi = messages; // History is the state *before* adding the new user message

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await callLingoBuddyApi(messageText, historyForApi, targetLanguage, chatMode, selectedMission);
      const responseText = data.text;
      
      let modelMessage: ChatMessage;
      let correction: ChatMessage['correction'] = null;

      if (chatMode === ChatMode.CROSSTALK) {
        modelMessage = { role: Role.MODEL, text: responseText };
      } else {
        const parsedData = JSON.parse(responseText);
        modelMessage = { role: Role.MODEL, text: parsedData.response };
        correction = parsedData.correction || null;
      }
      
      setMessages(prev => {
        // Find the user message we just added and attach the correction if it exists
        const updatedMessages = prev.map(msg => 
            (msg === userMessage && correction) ? { ...msg, correction } : msg
        );
        return [...updatedMessages, modelMessage];
      });

    } catch (e: any) {
      console.error(e);
      setError(`Sorry, something went wrong. ${e.message}`);
      // Remove the optimistic user message if the API call failed
      setMessages(prev => prev.filter(msg => msg !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTargetLanguage(null);
    setChatMode(null);
    setSelectedMission(null);
    setMessages([]);
    setError(null);
    setIsLoading(false);
  };
  
  const renderContent = () => {
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-screen text-center max-w-2xl">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Start Over
          </button>
        </div>
       );
    }

    if (!targetLanguage) {
      return <LanguageSelector onLanguageSelect={setTargetLanguage} />;
    }
  
    if (!chatMode) {
      return <ModeSelector onModeSelect={setChatMode} languageName={targetLanguage.name} />;
    }

    if (chatMode === ChatMode.MISSIONS && !selectedMission) {
      return <MissionSelector onMissionSelect={setSelectedMission} languageName={targetLanguage.name} />;
    }
  
    return (
      <ChatWindow 
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onReset={handleReset}
        targetLanguageName={targetLanguage.name}
        chatMode={chatMode === ChatMode.IMMERSION ? 'Immersion' : chatMode === ChatMode.CROSSTALK ? 'Crosstalk' : 'Missions'}
        missionTitle={selectedMission?.title}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        {renderContent()}
    </div>
  );
};

export default App;
