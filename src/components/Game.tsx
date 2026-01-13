'use client';

import { useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { GameCanvas } from './GameCanvas';
import { ItemList } from './ItemList';
import { Timer } from './Timer';
import { WinModal } from './WinModal';
import { Level } from '@/types/game';

interface GameProps {
  level: Level;
  onBack?: () => void;
}

export function Game({ level, onBack }: GameProps) {
  const {
    gameState,
    elapsedTime,
    findItem,
    resetGame,
  } = useGameState(level);

  const { playFoundSound, playWinSound } = useSound();
  const prevFoundCount = useRef(gameState.foundItems.length);

  // Play sound when item is found
  useEffect(() => {
    if (gameState.foundItems.length > prevFoundCount.current) {
      if (gameState.isComplete) {
        playWinSound();
      } else {
        playFoundSound();
      }
    }
    prevFoundCount.current = gameState.foundItems.length;
  }, [gameState.foundItems.length, gameState.isComplete, playFoundSound, playWinSound]);

  const finalTime = gameState.endTime && gameState.startTime
    ? gameState.endTime - gameState.startTime
    : elapsedTime;

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-blue-950 shadow-lg overflow-hidden">
        {/* Diagonal Stripes Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.05) 10px,
              rgba(255,255,255,0.05) 20px
            )`,
          }}
        />
        <div className="relative flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="text-3xl">🔍</div>
          <div>
            <h1 className="text-xl font-bold text-blue-100">LookieLu</h1>
            <p className="text-xs text-blue-300">Level: {level.name}</p>
          </div>
        </div>

        <Timer
          elapsedTime={elapsedTime}
          isRunning={!!gameState.startTime && !gameState.isComplete}
        />
      </header>

      {/* Game Canvas */}
      <GameCanvas
        backgroundImage={level.backgroundImage}
        items={level.items}
        foundItems={gameState.foundItems}
        selectedItems={gameState.selectedItems}
        onItemClick={findItem}
      />

      {/* Item List */}
      <ItemList
        items={gameState.selectedItems}
        foundItems={gameState.foundItems}
        sceneImage={level.backgroundImage}
      />

      {/* Win Modal */}
      {gameState.isComplete && (
        <WinModal
          levelId={level.id}
          levelName={level.name}
          time={finalTime}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
}
