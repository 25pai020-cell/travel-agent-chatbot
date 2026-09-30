'use client';

import React, { useState } from 'react';
import { User, Compass, ShieldCheck, ArrowRight, Heart, Lock, Mail, Sparkles } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  travelStyle: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (profile: UserProfile) => void;
}

const TRAVEL_STYLES = [
  { id: 'nature', label: '🌿 Nature & Adventure', desc: 'Mountains, trekking, valleys & snow' },
  { id: 'beach', label: '🏖️ Beach & Relaxation', desc: 'Coastal seas, watersports & sunsets' },
  { id: 'cultural', label: '🏛️ Culture & Heritage', desc: 'Historical forts, palaces & monuments' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family & Spiritual', desc: 'Scenic sightseeing, temples & group tours' },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [email, setEmail] = useState('sneha@traveler.ai');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Sneha');
  const [selectedStyle, setSelectedStyle] = useState('nature');

  if (!isOpen) return null;

  const handleProcessLogin = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    const userEmail = email.trim() || 'sneha@traveler.ai';
    const derivedName = name.trim() || 'Sneha';

    onLogin({
      name: derivedName,
      email: userEmail,
      travelStyle: selectedStyle
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleProcessLogin();
    }
  };

  return (
    <div className="relative w-full max-w-md my-auto animate-fade-in">
      <div className="relative w-full rounded-3xl bg-white/95 border border-white/80 p-6 sm:p-8 shadow-2xl shadow-slate-900/30 backdrop-blur-xl text-slate-900">
        {/* Glow accent header line */}
        <div className="absolute top-0 left-10 right-10 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-b-full" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-3">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Travel AI Login
          </h2>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Enter your Email and Password to start chatting and planning trips!
          </p>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Address</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. sneha@example.com"
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              <span>Your Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Sneha"
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder-slate-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Travel Preference</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`text-left p-2 rounded-xl border text-[11px] transition-all ${
                    selectedStyle === style.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-400'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="truncate">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleProcessLogin}
            className="w-full mt-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Login & Open Chatbot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Login
          </span>
          <span>Offline AI Travel Chatbot</span>
        </div>
      </div>
    </div>
  );
};
