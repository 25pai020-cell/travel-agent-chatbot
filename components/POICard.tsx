'use client';

import React, { useState } from 'react';
import {
  Clock, Star, Ticket, Camera, Sun, Flame, Sparkles,
  ChevronDown, ChevronUp, Tag, Eye, Compass
} from 'lucide-react';

export interface POI {
  id: number;
  name: string;
  destination: string;
  type: string;
  time_needed_hrs: number;
  rating: number;
  entrance_fee_inr: number;
  significance: string;
  best_time_to_visit: string;
  dslr_allowed?: string;
  characteristics: string[];
  description?: string;
  match_score: number;
  match_level: string;
  is_high_match: boolean;
  matched_interests: string[];
  match_badge: string;
  match_explanation?: string;
}

interface POICardProps {
  poi: POI;
  userInterests?: string[];
  rank: number;
}

const CHARACTERISTIC_COLORS: Record<string, string> = {
  nature: 'bg-green-50 text-green-700 border-green-200',
  adventure: 'bg-orange-50 text-orange-700 border-orange-200',
  snow: 'bg-sky-50 text-sky-700 border-sky-200',
  skiing: 'bg-blue-50 text-blue-700 border-blue-200',
  paragliding: 'bg-violet-50 text-violet-700 border-violet-200',
  scenic: 'bg-teal-50 text-teal-700 border-teal-200',
  mountains: 'bg-slate-100 text-slate-700 border-slate-200',
  'high altitude': 'bg-slate-100 text-slate-700 border-slate-200',
  waterfall: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  trekking: 'bg-amber-50 text-amber-700 border-amber-200',
  religious: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  temple: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  spiritual: 'bg-purple-50 text-purple-700 border-purple-200',
  historical: 'bg-rose-50 text-rose-700 border-rose-200',
  cultural: 'bg-pink-50 text-pink-700 border-pink-200',
  photography: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shopping: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  food: 'bg-red-50 text-red-700 border-red-200',
  market: 'bg-lime-50 text-lime-800 border-lime-200',
  wellness: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  wildlife: 'bg-green-100 text-green-800 border-green-200',
  beach: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  architecture: 'bg-slate-100 text-slate-700 border-slate-200',
  heritage: 'bg-amber-100 text-amber-800 border-amber-200',
  engineering: 'bg-slate-100 text-slate-700 border-slate-200',
  'hot spring': 'bg-rose-100 text-rose-800 border-rose-200',
  relaxation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  walking: 'bg-lime-50 text-lime-800 border-lime-200',
};

function getCharColor(char: string): string {
  const key = char.toLowerCase();
  return CHARACTERISTIC_COLORS[key] ?? 'bg-slate-100 text-slate-700 border-slate-200';
}

function renderStars(rating: number): React.ReactNode {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        let fill = 0;
        if (i < full) fill = 100;
        else if (i === full) fill = Math.round(partial * 100);
        return (
          <div key={i} className="relative w-3 h-3">
            <Star className="absolute inset-0 w-3 h-3 text-slate-300" fill="currentColor" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const POI_IMAGES: Record<string, string> = {
  'solang valley': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'rohtang pass': 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80',
  'hadimba temple': 'https://images.unsplash.com/photo-1605649487212-47bdab06cfdf?auto=format&fit=crop&w=600&q=80',
  'hidimba devi temple': 'https://images.unsplash.com/photo-1605649487212-47bdab06cfdf?auto=format&fit=crop&w=600&q=80',
  'jogini falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'jogini waterfall': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'mall road': 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80',
  'manali market': 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80',
  'atal tunnel': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'vashisht hot springs': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
};

function getPoiImageUrl(name: string, type: string): string {
  const key = name.toLowerCase().trim();
  for (const k in POI_IMAGES) {
    if (key.includes(k) || k.includes(key)) {
      return POI_IMAGES[k];
    }
  }
  const t = type.toLowerCase();
  if (t.includes('temple') || t.includes('shrine')) return 'https://images.unsplash.com/photo-1605649487212-47bdab06cfdf?auto=format&fit=crop&w=600&q=80';
  if (t.includes('waterfall') || t.includes('falls')) return 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80';
  if (t.includes('trek') || t.includes('hike') || t.includes('pass')) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
  if (t.includes('market') || t.includes('shopping')) return 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80';
  if (t.includes('beach') || t.includes('coast')) return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
}

export const POICard: React.FC<POICardProps> = ({ poi, userInterests = [], rank }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    name, type, time_needed_hrs, rating, entrance_fee_inr,
    significance, best_time_to_visit, dslr_allowed, characteristics,
    description, match_score, match_level, is_high_match,
    matched_interests, match_badge, match_explanation,
  } = poi;

  const imageUrl = getPoiImageUrl(name, type);

  const badgeStyle = is_high_match
    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
    : match_level === 'MEDIUM MATCH'
    ? 'bg-emerald-600 text-white shadow-md'
    : 'bg-slate-200 text-slate-700';

  const cardBorder = is_high_match
    ? 'border-orange-300 hover:border-orange-400 shadow-orange-500/10'
    : match_level === 'MEDIUM MATCH'
    ? 'border-teal-300 hover:border-teal-400'
    : 'border-slate-200 hover:border-slate-300';

  const barColor = match_score >= 90
    ? 'bg-gradient-to-r from-orange-500 to-red-500'
    : match_score >= 75
    ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
    : 'bg-gradient-to-r from-slate-400 to-slate-300';

  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <div
      className={`relative rounded-2xl bg-white border overflow-hidden transition-all duration-300 shadow-md ${cardBorder} ${
        is_high_match ? 'ring-1 ring-orange-300' : ''
      }`}
    >
      {/* POI Photo Thumbnail Header */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

        {/* Top Badges Overlaid on Image */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <span className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-900 border border-slate-200 shadow-sm">
            {rankEmoji} Rank #{rank}
          </span>

          <div className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-bold uppercase tracking-wider ${badgeStyle} flex items-center gap-1`}>
            {is_high_match ? (
              <Flame className="w-3 h-3 text-yellow-300" />
            ) : (
              <Sparkles className="w-3 h-3 text-emerald-300" />
            )}
            <span>{match_badge}</span>
          </div>
        </div>

        {/* Name on Image Bottom */}
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-base font-bold text-white drop-shadow-md leading-tight">{name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/90 text-emerald-700 border border-emerald-300 shadow-sm">
              {type}
            </span>
            <span className="text-[10px] text-slate-200 truncate drop-shadow">{significance}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5">

        {/* Match Score Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500">Interest Match</span>
            <span className={`text-[10px] font-bold ${is_high_match ? 'text-orange-600' : match_score >= 75 ? 'text-teal-600' : 'text-slate-500'}`}>
              {match_score}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${match_score}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center gap-1">
            {renderStars(rating)}
            <span className="text-[10px] text-amber-600 font-semibold">{rating.toFixed(1)}</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] text-slate-700 font-medium">{time_needed_hrs}h</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] text-slate-700 font-medium">
              {entrance_fee_inr === 0 ? 'Free' : `₹${entrance_fee_inr}`}
            </span>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-[10px] text-slate-700 font-medium">{best_time_to_visit}</span>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wide">Characteristics</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {characteristics.map((char, idx) => {
              const charLow = char.toLowerCase();
              const isMatched =
                matched_interests.some((mi) => mi.toLowerCase() === charLow) ||
                userInterests.some(
                  (ui) => charLow.includes(ui.toLowerCase()) || ui.toLowerCase().includes(charLow)
                );
              return (
                <span
                  key={idx}
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                    isMatched
                      ? `${getCharColor(char)} ring-1 ring-current ring-offset-1 ring-offset-white font-bold`
                      : getCharColor(char)
                  }`}
                >
                  {isMatched && '✓ '}
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Match Explanation */}
        {match_explanation && (
          <div
            className={`text-[11px] px-3 py-2 rounded-lg mb-3 border ${
              is_high_match
                ? 'bg-orange-50 border-orange-200 text-orange-800'
                : match_level === 'MEDIUM MATCH'
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {is_high_match && '🔥 '}{match_explanation}
          </div>
        )}

        {/* Matched Interest Pills */}
        {matched_interests.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[10px] text-slate-500">Matched:</span>
            {matched_interests.map((mi, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold"
              >
                ✓ {mi}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Description */}
        {description && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span>{expanded ? 'Less info' : 'More info'}</span>
            </button>
            {expanded && (
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-2">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Camera className="w-3 h-3" />
            <span>DSLR: {dslr_allowed ?? 'Yes'}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <Compass className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">{best_time_to_visit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
