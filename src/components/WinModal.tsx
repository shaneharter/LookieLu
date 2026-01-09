'use client';

import { useEffect, useState, useCallback } from 'react';
import { LeaderboardEntry } from '@/types/game';

const LEADERBOARD_KEY = 'look-and-find-leaderboard';

interface WinModalProps {
  levelId: string;
  levelName: string;
  time: number;
  onPlayAgain: () => void;
}

function getLeaderboard(levelId: string): LeaderboardEntry[] {
  try {
    const existing = localStorage.getItem(LEADERBOARD_KEY);
    if (!existing) return [];
    const leaderboard: LeaderboardEntry[] = JSON.parse(existing);
    return leaderboard
      .filter(e => e.levelId === levelId)
      .sort((a, b) => a.time - b.time)
      .slice(0, 10);
  } catch {
    return [];
  }
}

function saveToLeaderboard(entry: LeaderboardEntry) {
  try {
    const existing = localStorage.getItem(LEADERBOARD_KEY);
    const leaderboard: LeaderboardEntry[] = existing ? JSON.parse(existing) : [];
    leaderboard.push(entry);
    // Keep top 10 per level
    const filtered = leaderboard
      .filter(e => e.levelId === entry.levelId)
      .sort((a, b) => a.time - b.time)
      .slice(0, 10);
    const others = leaderboard.filter(e => e.levelId !== entry.levelId);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify([...filtered, ...others]));
  } catch {
    // Ignore localStorage errors
  }
}

export function WinModal({ levelId, levelName, time, onPlayAgain }: WinModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    const entries = getLeaderboard(levelId);
    setLeaderboard(entries);

    // Check if this would be a new record
    if (entries.length === 0 || time < entries[0].time) {
      setIsNewRecord(true);
    }
  }, [levelId, time]);

  const handleSave = useCallback(() => {
    if (!playerName.trim()) return;

    const entry: LeaderboardEntry = {
      levelId,
      playerName: playerName.trim(),
      time,
      date: new Date().toISOString(),
      itemsFound: 10,
    };

    saveToLeaderboard(entry);
    setLeaderboard(getLeaderboard(levelId));
    setHasSaved(true);
  }, [levelId, playerName, time]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
          <div className="text-6xl mb-2">
            {isNewRecord ? '🏆' : '🎉'}
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {isNewRecord ? 'New Record!' : 'Great Job!'}
          </h2>
          <p className="text-green-100 mt-1">You cleaned up the {levelName}!</p>
        </div>

        {/* Time Display */}
        <div className="p-6 text-center">
          <div className="text-lg text-amber-700 mb-1">Your Time</div>
          <div className="text-5xl font-bold font-mono text-amber-900">
            {formatTime(time)}
          </div>
        </div>

        {/* Name Input */}
        {!hasSaved && (
          <div className="px-6 pb-4">
            <label className="block text-amber-800 font-bold mb-2">
              Enter your name for the leaderboard:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                maxLength={20}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-400 focus:border-amber-600 focus:outline-none text-lg bg-white text-gray-900 placeholder-gray-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
              />
              <button
                onClick={handleSave}
                disabled={!playerName.trim()}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span>🏅</span> Best Times
            </h3>
            <div className="bg-white/50 rounded-xl overflow-hidden">
              {leaderboard.slice(0, 5).map((entry, index) => {
                const isCurrentEntry = hasSaved && entry.time === time && entry.playerName === playerName.trim();
                return (
                  <div
                    key={`${entry.date}-${entry.time}-${entry.playerName}`}
                    className={`flex items-center justify-between px-4 py-2 ${
                      index % 2 === 0 ? 'bg-white/30' : ''
                    } ${isCurrentEntry ? 'bg-yellow-200/70' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg w-6 ${isCurrentEntry ? 'text-green-700' : 'text-amber-700'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <span className="truncate max-w-[100px] text-amber-800">{entry.playerName}</span>
                      <span className="text-sm text-amber-600">{formatDate(entry.date)}</span>
                    </div>
                    <span className="font-mono text-amber-900">{formatTime(entry.time)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Play Again Button */}
        <div className="p-6 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
