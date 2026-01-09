export interface HiddenItem {
  id: string;
  name: string;
  // Position in pixels relative to scene
  x: number;
  y: number;
  width: number;
  height: number;
  difficulty: 'easy' | 'medium' | 'hard';
  // Sprite image path (for overlay mode)
  sprite?: string;
  // For thumbnail: crop coordinates from main scene image (legacy)
  thumbX?: number;
  thumbY?: number;
  thumbWidth?: number;
  thumbHeight?: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  items: HiddenItem[];
  // How many items to select per game
  itemsPerGame: number;
}

export interface GameState {
  level: Level;
  selectedItems: HiddenItem[];
  foundItems: string[];
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
}

export interface LeaderboardEntry {
  levelId: string;
  playerName: string;
  time: number;
  date: string;
  itemsFound: number;
}
