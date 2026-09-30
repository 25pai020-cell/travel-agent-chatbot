import React from 'react';
import { MapPin, Calendar, Wallet, Check, Sparkles, Compass } from 'lucide-react';

export interface Destination {
  id: number;
  rank: number;
  badge: string;
  destination_name: string;
  state: string;
  region?: string;
  match_percentage: number;
  trip_types: string[];
  best_seasons: string[];
  ideal_days: number;
  daily_budget_range: number[];
  primary_attractions: string[];
  activities_available: string[];
  unique_experiences?: string;
}

interface Props {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  isSelected?: boolean;
}

const DESTINATION_IMAGES: Record<string, string> = {
  'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  'munnar': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
  'jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  'udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
  'leh ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
  'rishikesh': 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
};

function getDestinationImageUrl(name: string): string {
  const key = name.toLowerCase();
  for (const k in DESTINATION_IMAGES) {
    if (key.includes(k) || k.includes(key)) {
      return DESTINATION_IMAGES[k];
    }
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
}

export const DestinationCard: React.FC<Props> = ({ destination, onSelect, isSelected = false }) => {
  const {
    rank,
    badge,
    destination_name,
    state,
    match_percentage,
    trip_types = [],
    ideal_days,
    daily_budget_range = [],
    primary_attractions = [],
    unique_experiences
  } = destination;

  const imageUrl = getDestinationImageUrl(destination_name);

  // Rank-based styling
  const rankBorderColor =
    rank === 1
      ? 'border-amber-300 hover:border-amber-400 shadow-amber-500/10'
      : rank === 2
      ? 'border-slate-300 hover:border-slate-400 shadow-slate-400/10'
      : 'border-emerald-300 hover:border-emerald-400 shadow-emerald-500/10';

  const matchBadgeColor =
    match_percentage >= 90
      ? 'bg-emerald-600 text-white shadow-md'
      : match_percentage >= 75
      ? 'bg-teal-600 text-white shadow-md'
      : 'bg-cyan-600 text-white shadow-md';

  return (
    <div
      className={`relative rounded-2xl bg-white border overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-md ${rankBorderColor} ${
        isSelected ? 'ring-2 ring-emerald-500 bg-white' : ''
      }`}
    >
      {/* Destination Photo Header */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={destination_name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-900 border border-slate-200 shadow-sm">
            {badge} #{rank} Destination
          </span>

          <div className={`px-2.5 py-1 rounded-full backdrop-blur-md text-xs font-bold ${matchBadgeColor} flex items-center gap-1 shrink-0`}>
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>{match_percentage}% Match</span>
          </div>
        </div>

        {/* Destination Title on Image Bottom */}
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-lg font-bold text-white drop-shadow-md flex items-center gap-1.5">
            {destination_name}
          </h3>
          <p className="text-xs text-emerald-300 flex items-center gap-1 drop-shadow">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{state}</span>
          </p>
        </div>
      </div>

      <div className="p-3.5">
        {/* Tags: Trip Types */}
        {trip_types && trip_types.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {trip_types.slice(0, 4).map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
              >
                {t.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Info Row: Ideal Days & Daily Budget */}
        <div className="grid grid-cols-2 gap-2 my-2.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Ideal: <strong className="text-slate-900">{ideal_days} Days</strong></span>
          </div>
          {daily_budget_range.length >= 2 && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>₹{daily_budget_range[0]} - {daily_budget_range[1]}/d</span>
            </div>
          )}
        </div>

        {/* Key Attractions */}
        {primary_attractions && primary_attractions.length > 0 && (
          <div className="mb-3">
            <div className="text-[11px] uppercase font-semibold text-slate-500 mb-1">Top Attractions:</div>
            <div className="text-xs text-slate-700 line-clamp-2">
              {primary_attractions.join(' • ')}
            </div>
          </div>
        )}

        {/* Select Destination Button */}
        <button
          onClick={() => onSelect(destination)}
          className={`w-full mt-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-600 text-white cursor-default shadow-md'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              <span>Selected Destination</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Select {destination_name} & Build Itinerary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
