'use client';

import { Level } from '@/types/game';

interface LevelSelectProps {
  levels: Level[];
  onSelectLevel: (level: Level) => void;
}

export function LevelSelect({ levels, onSelectLevel }: LevelSelectProps) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-900 to-blue-950 flex flex-col items-center justify-center p-6">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-blue-100 mb-2">🔍 LookieLu</h1>
        <p className="text-blue-300 text-lg">Choose a level to play</p>
      </div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level)}
            className="group relative overflow-hidden rounded-2xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${level.backgroundImage})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative p-6 h-48 flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-white mb-1">{level.name}</h2>
              <p className="text-gray-300 text-sm">{level.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="bg-blue-500/80 text-white text-xs px-3 py-1 rounded-full">
                  {level.items.length} items
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
