'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { LoginModal, UserProfile } from '@/components/LoginModal';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sneha',
  email: 'sneha@traveler.ai',
  travelStyle: 'nature'
};

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('travel_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.email)) {
          setUserProfile(parsed);
        }
      }
    } catch (e) {
      console.error('Error reading saved profile:', e);
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    const validProfile = profile && profile.name ? profile : DEFAULT_PROFILE;
    setUserProfile(validProfile);
    try {
      localStorage.setItem('travel_user_profile', JSON.stringify(validProfile));
    } catch (e) {}
    setIsLoginOpen(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-x-hidden text-slate-900">
      {/* Background Travel Image (Pink flat-lay airplane & map) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-100"
        style={{ 
          backgroundImage: `url('/images/chat-bg.jpg')` 
        }}
      />
      
      {/* Subtle Backdrop Tint to preserve text legibility */}
      <div className="fixed inset-0 z-0 bg-white/30 backdrop-blur-[2px]" />

      {/* Main App Layout */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header 
          userProfile={userProfile} 
          onOpenLogin={() => setIsLoginOpen(true)} 
        />
        
        <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-4rem)]">
          {/* Chatbot Interface Direct Main View */}
          <ChatInterface userProfile={userProfile} />
        </div>
      </div>

      {/* Optional User Login & Profile Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <LoginModal 
            isOpen={true} 
            onLogin={handleLogin} 
          />
        </div>
      )}
    </main>
  );
}
