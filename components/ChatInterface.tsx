'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw, Compass, MapPin, SlidersHorizontal } from 'lucide-react';
import { PreferenceBadges, Preferences } from './PreferenceBadges';
import { DestinationCard, Destination } from './DestinationCard';
import { POICard, POI } from './POICard';
import { UserProfile } from './LoginModal';

interface ChatInterfaceProps {
  userProfile?: UserProfile | null;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  preferences?: Preferences;
  destinations?: Destination[];
  pois?: POI[];
  selectedDestination?: string;
  queryId?: number;
  dbSaved?: boolean;
}

const SAMPLE_PROMPTS = [
  "Manali",
  "I want a 4-day nature and adventure trip under ₹20,000 in winter.",
  "Remove temples and add more adventure.",
  "Plan a 7-day cultural & spiritual tour for family with budget 50000 in autumn.",
  "Solo 5 days wildlife safari and photography trip in December under 30000."
];

const getFormattedTime = () => {
  if (typeof window === 'undefined') return 'Just now';
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile }) => {
  const userName = userProfile?.name || 'Traveler';
  const [sessionId] = useState<string>(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${userName}! 👋 I am your Offline AI Travel Planning Assistant. Tell me what kind of trip you want (e.g. '4-day nature and adventure trip under ₹20,000 in winter' or select 'Manali'), and our local ML system will extract your preferences, score POIs out of 100, enforce an 8-hour daily sightseeing limit, and generate a day-wise itinerary!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestinationName, setSelectedDestinationName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchChatMessage = async (textToSend: string) => {
    const payload = {
      message: textToSend,
      session_id: sessionId
    };

    const endpoints = [
      'http://127.0.0.1:8000/api/chat/message',
      'http://localhost:8000/api/chat/message',
      '/api/chat/message'
    ];

    let lastErr: any = null;
    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Backend server unreachable");
  };

  const handleSendMessage = async (customText?: string) => {
    let textToSend = '';
    if (typeof customText === 'string' && customText.trim()) {
      textToSend = customText.trim();
    } else {
      textToSend = input.trim() || 'Manali';
    }

    if (loading) return;

    setError(null);
    setInput('');

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: getFormattedTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await fetchChatMessage(textToSend);

      if (data.selected_destination) {
        setSelectedDestinationName(data.selected_destination);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply,
        timestamp: getFormattedTime(),
        preferences: data.extracted_preferences,
        destinations: data.destinations || [],
        pois: data.pois || [],
        selectedDestination: data.selected_destination,
        queryId: data.query_id,
        dbSaved: data.db_saved
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat API Error:', err);
      setError('Could not connect to local backend server. Please make sure FastAPI backend is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestinationName(destination.destination_name);
    handleSendMessage(`I choose ${destination.destination_name}! Please build my day-wise itinerary.`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto w-full px-3 sm:px-4 py-4">
      {/* Quick Prompts */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Prompts & Modifications:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500/50 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl bg-white/75 border border-white/80 p-4 shadow-2xl backdrop-blur-md">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-emerald-600 border border-slate-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[90%] sm:max-w-[85%]`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-900/10'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm font-mono text-xs sm:text-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span suppressHydrationWarning className="block mt-1.5 text-[10px] text-slate-400 text-right font-sans">
                  {msg.timestamp}
                </span>
              </div>

              {/* Extracted preferences card */}
              {msg.preferences && (
                <PreferenceBadges
                  preferences={msg.preferences}
                  queryId={msg.queryId}
                  dbSaved={msg.dbSaved}
                />
              )}

              {/* Recommended Destination Cards */}
              {msg.destinations && msg.destinations.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 px-1">
                    <Compass className="w-4 h-4" />
                    <span>Top ML Recommended Destinations:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {msg.destinations.map((dest) => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        onSelect={handleSelectDestination}
                        isSelected={selectedDestinationName === dest.destination_name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* POI Cards */}
              {msg.pois && msg.pois.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 px-1">
                    <MapPin className="w-4 h-4" />
                    <span>Ranked Points of Interest (POIs) with Enriched Characteristics:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.pois.map((poi, idx) => (
                      <POICard
                        key={poi.id || idx}
                        poi={poi}
                        userInterests={msg.preferences?.interests || []}
                        rank={idx + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-emerald-600 border border-slate-200 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Running POI scoring, 8h/day itinerary constraint algorithm & budget checks...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your trip request (e.g. Manali, or 'Remove temples and add more adventure')..."
            className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-3.5 pr-10 outline-none transition-all shadow-sm"
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSendMessage()}
          className="h-12 px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline text-sm">{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};



