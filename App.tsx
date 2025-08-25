import React, { useState, useCallback, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { ModeSelector } from './components/ModeSelector';
import { MissionSelector } from './components/MissionSelector';
import { ChatWindow } from './components/ChatWindow';
import type { Language, ChatMessage, Mission, Correction } from './types';
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
        console.error('Network or fetch error:', e);
        throw new Error(`Could not connect to the LingoBuddy service. Please check your network connection and API configuration. (${e.message})`);
    }
  };

  /**
   * Safely parses the API response.
   * For Crosstalk, it returns the text directly.
   * For other modes, it tries to parse JSON, but falls back to plain text if parsing fails.
  */
  const parseApiResponse = (responseText: string, mode: ChatMode): { response: string; correction: Correction | null } => {
    if (mode === ChatMode.CROSSTALK) {
        return { response: responseText, correction: null };
    }

    // For IMMERSION and MISSIONS, we expect JSON but prepare for errors.
    try {
        if (!responseText || typeof responseText !== 'string') {
            throw new Error("AI returned an empty or invalid response.");
        }
        const parsedData = JSON.parse(responseText);
        
        if (typeof parsedData.response !== 'string') {
            throw new Error("AI response JSON is missing the required 'response' field.");
        }

        return {
            response: parsedData.response,
            correction: parsedData.correction || null,
        };
    } catch (e) {
        console.warn("Could not parse AI response as JSON. Treating as plain text.", { responseText, error: e });
        // Graceful fallback: treat the whole string as a plain text response from the model.
        return { response: responseText, correction: null };
    }
  };

  const initializeChat = useCallback(async (lang: Language, mode: ChatMode, mission: Mission | null) => {
    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const data = await callLingoBuddyApi("Start conversation", [], lang, mode, mission);
      const { response, correction } = parseApiResponse(data.text, mode);

      const firstMessage: ChatMessage = { 
        role: Role.MODEL, 
        text: response, 
        correction 
      };
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
    const historyForApi = messages; 

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await callLingoBuddyApi(messageText, historyForApi, targetLanguage, chatMode, selectedMission);
      const { response: modelResponseText, correction: responseCorrection } = parseApiResponse(data.text, chatMode);
      
      const modelMessage: ChatMessage = { role: Role.MODEL, text: modelResponseText };
      
      setMessages(prev => {
        // Find the user message we just added and attach the correction if it exists
        const updatedMessages = prev.map(msg => 
            (msg === userMessage && responseCorrection) ? { ...msg, correction: responseCorrection } : msg
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
        <div className="flex flex-col items-center justify-center h-screen text-center max-w-2xl mx-auto">
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