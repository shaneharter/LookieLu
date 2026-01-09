import { Game } from '@/components/Game';
import { garageLevel } from '@/data/levels/garage';

export default function Home() {
  return <Game level={garageLevel} />;
}
