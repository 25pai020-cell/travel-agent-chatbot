import React from 'react';
import { Calendar, Wallet, SunSnow, Sparkles, Users, CheckCircle2 } from 'lucide-react';

export interface Preferences {
  days?: number | null;
  budget?: number | null;
  interests?: string[];
  season?: string | null;
  group_type?: string | null;
}

interface Props {
  preferences: Preferences;
  queryId?: number;
  dbSaved?: boolean;
}

export const PreferenceBadges: React.FC<Props> = ({ preferences, queryId, dbSaved = true }) => {
  const { days, budget, interests = [], season, group_type } = preferences;

  const hasAnyPreference = days || budget || (interests && interests.length > 0) || season || group_type;

  if (!hasAnyPreference) return null;

  return (
    <div className="mt-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Extracted NLP Travel Preferences</span>
        </div>
        {dbSaved && (
          <div className="flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            <span>Saved in DB {queryId ? `(#${queryId})` : ''}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Days */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Duration</div>
            <div className="text-xs font-semibold text-slate-900 truncate">
              {days ? `${days} Days` : 'Not specified'}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Wallet className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Budget</div>
            <div className="text-xs font-semibold text-slate-900 truncate">
              {budget ? `₹${budget.toLocaleString('en-IN')}` : 'Flexible'}
            </div>
          </div>
        </div>

        {/* Season */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <SunSnow className="w-4 h-4 text-cyan-600 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Season</div>
            <div className="text-xs font-semibold text-slate-900 capitalize truncate">
              {season || 'Any season'}
            </div>
          </div>
        </div>

        {/* Group Type */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <Users className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase font-medium">Companions</div>
            <div className="text-xs font-semibold text-slate-900 capitalize truncate">
              {group_type || 'General'}
            </div>
          </div>
        </div>
      </div>

      {/* Interests list */}
      {interests && interests.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap pt-2.5 border-t border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">Themes / Interests:</span>
          {interests.map((interest) => (
            <span
              key={interest}
              className="text-xs capitalize font-medium px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700"
            >
              🌿 {interest}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
