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
}

export function Game({ level }: GameProps) {
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
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🔍</div>
          <div>
            <h1 className="text-xl font-bold text-amber-100">{level.name}</h1>
            <p className="text-xs text-amber-300">Find all the hidden items!</p>
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
