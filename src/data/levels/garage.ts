import { Level, HiddenItem } from '@/types/game';

// Scene dimensions: 1536x1024
// Position items to blend into the garage scene

export const garageItems: HiddenItem[] = [
  // Hammer - on the workbench
  {
    id: 'hammer',
    name: 'Hammer',
    x: 200,
    y: 450,
    width: 90,
    height: 90,
    difficulty: 'easy',
    sprite: '/sprites/hammer.png',
  },
  // Wrench - on workbench near tools
  {
    id: 'wrench',
    name: 'Wrench',
    x: 320,
    y: 500,
    width: 120,
    height: 50,
    difficulty: 'medium',
    sprite: '/sprites/wrench.png',
  },
  // Flashlight - on right shelf
  {
    id: 'flashlight',
    name: 'Flashlight',
    x: 1280,
    y: 400,
    width: 110,
    height: 55,
    difficulty: 'medium',
    sprite: '/sprites/flashlight.png',
  },
  // Keys - on workbench
  {
    id: 'keys',
    name: 'Keys',
    x: 140,
    y: 500,
    width: 60,
    height: 75,
    difficulty: 'hard',
    sprite: '/sprites/keys.png',
  },
  // Lantern - on right shelf near the glowing one
  {
    id: 'lantern',
    name: 'Lantern',
    x: 1360,
    y: 220,
    width: 75,
    height: 95,
    difficulty: 'easy',
    sprite: '/sprites/lantern.png',
  },
  // Bucket - on floor near shelves
  {
    id: 'bucket',
    name: 'Bucket',
    x: 1120,
    y: 650,
    width: 100,
    height: 110,
    difficulty: 'easy',
    sprite: '/sprites/bucket.png',
  },
];

export const garageLevel: Level = {
  id: 'garage',
  name: 'Dusty Garage',
  description: 'Find all the hidden items in this cluttered garage!',
  backgroundImage: '/garage-photo.png',
  items: garageItems,
  itemsPerGame: 6,
};
