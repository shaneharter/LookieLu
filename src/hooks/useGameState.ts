'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, HiddenItem, Level } from '@/types/game';

function selectRandomItems(items: HiddenItem[], count: number): HiddenItem[] {
  // Ensure mix of difficulties
  const easy = items.filter(i => i.difficulty === 'easy');
  const medium = items.filter(i => i.difficulty === 'medium');
  const hard = items.filter(i => i.difficulty === 'hard');

  const selected: HiddenItem[] = [];

  // Pick 2-3 easy, 4-5 medium, 2-3 hard
  const easyCount = Math.min(easy.length, Math.floor(Math.random() * 2) + 2);
  const hardCount = Math.min(hard.length, Math.floor(Math.random() * 2) + 2);
  const mediumCount = count - easyCount - hardCount;

  // Shuffle and pick
  const shuffleAndPick = (arr: HiddenItem[], n: number) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  selected.push(...shuffleAndPick(easy, easyCount));
  selected.push(...shuffleAndPick(medium, Math.min(medium.length, mediumCount)));
  selected.push(...shuffleAndPick(hard, hardCount));

  // If we don't have enough, fill from remaining
  if (selected.length < count) {
    const remaining = items.filter(i => !selected.includes(i));
    selected.push(...shuffleAndPick(remaining, count - selected.length));
  }

  // Shuffle final selection so difficulties aren't grouped
  return selected.sort(() => Math.random() - 0.5);
}

export function useGameState(level: Level) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    level,
    selectedItems: selectRandomItems(level.items, level.itemsPerGame),
    foundItems: [],
    startTime: null,
    endTime: null,
    isComplete: false,
  }));

  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameState.startTime && !gameState.isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - gameState.startTime!);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.startTime, gameState.isComplete]);

  const findItem = useCallback((itemId: string) => {
    setGameState(prev => {
      // Start timer on first find if not started
      const startTime = prev.startTime ?? Date.now();

      if (prev.foundItems.includes(itemId)) {
        return prev;
      }

      const newFoundItems = [...prev.foundItems, itemId];
      const isComplete = newFoundItems.length === prev.selectedItems.length;
      const endTime = isComplete ? Date.now() : null;

      return {
        ...prev,
        startTime,
        foundItems: newFoundItems,
        isComplete,
        endTime,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      level,
      selectedItems: selectRandomItems(level.items, level.itemsPerGame),
      foundItems: [],
      startTime: null,
      endTime: null,
      isComplete: false,
    });
    setElapsedTime(0);
  }, [level]);

  return {
    gameState,
    elapsedTime,
    findItem,
    resetGame,
  };
}
