'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { HiddenItem } from '@/types/game';

interface GameCanvasProps {
  backgroundImage: string;
  items: HiddenItem[];
  foundItems: string[];
  selectedItems: HiddenItem[];
  onItemClick: (itemId: string) => void;
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

export function GameCanvas({
  backgroundImage,
  items,
  foundItems,
  selectedItems,
  onItemClick,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);

  // Image dimensions (matching new garage photo)
  const imageWidth = 1536;
  const imageHeight = 1024;

  const clampTransform = useCallback((t: Transform): Transform => {
    const container = containerRef.current;
    if (!container) return t;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaledWidth = imageWidth * t.scale;
    const scaledHeight = imageHeight * t.scale;

    let { x, y } = t;

    // If image is smaller than container, center it
    if (scaledWidth <= containerWidth) {
      x = (containerWidth - scaledWidth) / 2;
    } else {
      // Clamp to edges
      x = Math.min(0, Math.max(containerWidth - scaledWidth, x));
    }

    if (scaledHeight <= containerHeight) {
      y = (containerHeight - scaledHeight) / 2;
    } else {
      y = Math.min(0, Math.max(containerHeight - scaledHeight, y));
    }

    return { ...t, x, y };
  }, []);

  // Mouse down - start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  // Mouse move - drag if active
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform(prev => clampTransform({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, clampTransform]);

  // Mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setLastTouchDistance(distance);
      setLastTouchCenter({ x: centerX, y: centerY });
    } else if (e.touches.length === 1) {
      // Single touch - start drag
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y,
      });
    }
  }, [transform]);

  // Touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null && lastTouchCenter !== null) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = distance / lastTouchDistance;
      setLastTouchDistance(distance);

      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      setTransform(prev => {
        const newScale = Math.max(0.5, Math.min(3, prev.scale * scaleDelta));
        // Adjust position to zoom toward center
        const scaleRatio = newScale / prev.scale;
        const newX = centerX - (centerX - prev.x) * scaleRatio;
        const newY = centerY - (centerY - prev.y) * scaleRatio;
        return clampTransform({ scale: newScale, x: newX, y: newY });
      });

      setLastTouchCenter({ x: centerX, y: centerY });
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setTransform(prev => clampTransform({ ...prev, x: newX, y: newY }));
    }
  }, [lastTouchDistance, lastTouchCenter, isDragging, dragStart, clampTransform]);

  // Touch end
  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
    setLastTouchCenter(null);
    setIsDragging(false);
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scaleDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform(prev => {
      const newScale = Math.max(0.5, Math.min(3, prev.scale * scaleDelta));
      const scaleRatio = newScale / prev.scale;
      const newX = mouseX - (mouseX - prev.x) * scaleRatio;
      const newY = mouseY - (mouseY - prev.y) * scaleRatio;
      return clampTransform({ scale: newScale, x: newX, y: newY });
    });
  }, [clampTransform]);

  // Handle item click
  const handleItemClick = useCallback((e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();

    // Don't trigger on drag
    if (isDragging) return;

    // Only process if item is in the selected items for this game
    const isInGame = selectedItems.some(item => item.id === itemId);
    if (!isInGame) return;

    // Don't allow clicking already found items
    if (foundItems.includes(itemId)) return;

    onItemClick(itemId);
  }, [selectedItems, foundItems, onItemClick, isDragging]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setTransform(prev => clampTransform({ ...prev, scale: Math.min(3, prev.scale * 1.3) }));
  }, [clampTransform]);

  const zoomOut = useCallback(() => {
    setTransform(prev => clampTransform({ ...prev, scale: Math.max(0.5, prev.scale * 0.7) }));
  }, [clampTransform]);

  const resetZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);

    setTransform(clampTransform({
      scale: fitScale,
      x: (containerWidth - imageWidth * fitScale) / 2,
      y: (containerHeight - imageHeight * fitScale) / 2,
    }));
  }, [clampTransform]);

  // Initialize proper scale on mount
  useEffect(() => {
    resetZoom();
  }, [resetZoom]);

  return (
    <div className="relative flex-1 overflow-hidden bg-gray-800">
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 active:bg-gray-200 touch-manipulation"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 active:bg-gray-200 touch-manipulation"
          aria-label="Zoom out"
        >
          -
        </button>
        <button
          onClick={resetZoom}
          className="w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-700 active:bg-gray-200 touch-manipulation"
          aria-label="Reset zoom"
        >
          FIT
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: imageWidth,
            height: imageHeight,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            willChange: 'transform',
          }}
        >
          {/* Background Image */}
          <img
            src={backgroundImage}
            alt="Game scene"
            className="absolute inset-0 w-full h-full pointer-events-none"
            draggable={false}
          />

          {/* Render items as sprite overlays or invisible clickable regions */}
          {items.map(item => {
            const isFound = foundItems.includes(item.id);
            const isInGame = selectedItems.some(i => i.id === item.id);

            // Only render items for this game session
            if (!isInGame) return null;

            // Don't render if already found (sprite disappears!)
            if (isFound) return null;

            // If item has a sprite, render it as an image overlay
            if (item.sprite) {
              return (
                <div
                  key={item.id}
                  className="absolute select-none pointer-events-auto"
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                    cursor: 'pointer',
                  }}
                  onClick={(e) => handleItemClick(e, item.id)}
                >
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              );
            }

            // Fallback: invisible clickable region (legacy mode)
            return (
              <div
                key={item.id}
                className="absolute select-none"
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  cursor: 'inherit',
                }}
                onClick={(e) => handleItemClick(e, item.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
