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
    <div className="bg-gradient-to-t from-amber-900 to-amber-800 p-4 shadow-lg border-t-4 border-amber-600">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="relative w-full h-8 bg-amber-950 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-md">{foundCount} / {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Item Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map(item => {
          const isFound = foundItems.includes(item.id);

          // Don't render found items - they disappear
          if (isFound) return null;

          return (
            <div
              key={item.id}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-amber-700/80 shadow-md"
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
