import React from 'react';
import { Compass, ShieldCheck, Database, Cpu, User, LogOut } from 'lucide-react';
import { UserProfile } from './LoginModal';

interface HeaderProps {
  userProfile?: UserProfile | null;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onOpenLogin }) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Chatbot Travel
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                Offline ML
              </span>
            </h1>
            <p className="text-xs text-slate-500">Personalized Local Travel Planner</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {userProfile ? (
            <div className="flex items-center gap-2 bg-white border border-emerald-500/40 shadow-sm pl-2 pr-3 py-1 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-none">{userProfile.name}</div>
                <div className="text-[10px] text-emerald-600 capitalize mt-0.5">{userProfile.travelStyle}</div>
              </div>
              <button
                onClick={onOpenLogin}
                title="Switch Profile"
                className="ml-1 p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg transition-all font-semibold"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">100% Offline</span>
          </div>
        </div>
      </div>
    </header>
  );
};

