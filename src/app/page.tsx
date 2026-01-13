'use client';

import { useState } from 'react';
import { Game } from '@/components/Game';
import { LevelSelect } from '@/components/LevelSelect';
import { garageLevel } from '@/data/levels/garage';
import { hotelLevel } from '@/data/levels/hotel';
import { Level } from '@/types/game';

const levels = [garageLevel, hotelLevel];

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  if (!selectedLevel) {
    return <LevelSelect levels={levels} onSelectLevel={setSelectedLevel} />;
  }

  return (
    <Game
      level={selectedLevel}
      onBack={() => setSelectedLevel(null)}
    />
  );
}
