'use client';

import { HiddenItem } from '@/types/game';

interface ItemListProps {
  items: HiddenItem[];
  foundItems: string[];
  sceneImage: string;
}

export function ItemList({ items, foundItems, sceneImage }: ItemListProps) {
  const foundCount = foundItems.length;
  const totalCount = items.length;

  const progress = totalCount > 0 ? (foundCount / totalCount) * 100 : 0;

  return (
    <div className="relative bg-gradient-to-t from-slate-950 to-blue-950 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg border-t-4 border-blue-700 overflow-hidden">
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
      {/* Progress Bar */}
      <div className="relative mb-3">
        <div className="relative w-full h-8 bg-slate-950/60 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-400/80 to-cyan-400/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-md">{foundCount} / {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Item Thumbnails */}
      <div className="relative flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map(item => {
          const isFound = foundItems.includes(item.id);

          // Don't render found items - they disappear
          if (isFound) return null;

          return (
            <div
              key={item.id}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-blue-800/80 shadow-md"
            >
              {/* Sprite thumbnail or cropped scene thumbnail */}
              {item.sprite ? (
                <img
                  src={item.sprite}
                  alt={item.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div
                  style={{
                    width: item.thumbWidth ? Math.min(48 / item.thumbWidth, 48 / (item.thumbHeight || 48)) * item.thumbWidth : 48,
                    height: item.thumbHeight ? Math.min(48 / (item.thumbWidth || 48), 48 / item.thumbHeight) * item.thumbHeight : 48,
                    backgroundImage: `url(${sceneImage})`,
                    backgroundPosition: `-${(item.thumbX || 0) * Math.min(48 / (item.thumbWidth || 48), 48 / (item.thumbHeight || 48))}px -${(item.thumbY || 0) * Math.min(48 / (item.thumbWidth || 48), 48 / (item.thumbHeight || 48))}px`,
                    backgroundSize: `${768 * Math.min(48 / (item.thumbWidth || 48), 48 / (item.thumbHeight || 48))}px ${512 * Math.min(48 / (item.thumbWidth || 48), 48 / (item.thumbHeight || 48))}px`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
