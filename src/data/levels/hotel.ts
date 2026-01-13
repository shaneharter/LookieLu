import { Level, HiddenItem } from '@/types/game';

// Scene dimensions: 1536x1024
// Position items to blend into the hotel room scene

export const hotelItems: HiddenItem[] = [
  // Sunglasses - on cluttered desk surface, dark frames blend with shadows
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    x: 1280,
    y: 545,
    width: 85,
    height: 40,
    difficulty: 'medium',
    sprite: '/sprites/sunglasses.png',
  },
  // Passport - on desk among scattered maps and papers
  {
    id: 'passport',
    name: 'Passport',
    x: 1020,
    y: 555,
    width: 55,
    height: 70,
    difficulty: 'easy',
    sprite: '/sprites/passport.png',
  },
  // Camera - on desk near existing camera-like objects for camouflage
  {
    id: 'camera',
    name: 'Camera',
    x: 1160,
    y: 465,
    width: 80,
    height: 65,
    difficulty: 'easy',
    sprite: '/sprites/camera.png',
  },
  // Watch - lost among clothes on messy bed, golden tones blend with warm lighting
  {
    id: 'watch',
    name: 'Watch',
    x: 520,
    y: 510,
    width: 45,
    height: 55,
    difficulty: 'hard',
    sprite: '/sprites/watch.png',
  },
  // Flip flops - kicked off on wooden floor near green suitcase
  {
    id: 'flipflops',
    name: 'Flip Flops',
    x: 380,
    y: 765,
    width: 75,
    height: 85,
    difficulty: 'easy',
    sprite: '/sprites/flipflops.png',
  },
  // Sunscreen - on desk among other bottles and toiletries
  {
    id: 'sunscreen',
    name: 'Sunscreen',
    x: 1340,
    y: 505,
    width: 40,
    height: 60,
    difficulty: 'medium',
    sprite: '/sprites/sunscreen.png',
  },
];

export const hotelLevel: Level = {
  id: 'hotel',
  name: 'Beach Hotel',
  description: 'Find all the vacation items in this messy hotel room!',
  backgroundImage: '/hotel-room.png',
  items: hotelItems,
  itemsPerGame: 6,
};
