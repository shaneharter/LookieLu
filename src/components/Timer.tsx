'use client';

interface TimerProps {
  elapsedTime: number;
  isRunning: boolean;
}

export function Timer({ elapsedTime, isRunning }: TimerProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg ${
        isRunning
          ? 'bg-blue-500 text-white animate-pulse'
          : 'bg-blue-800 text-blue-100'
      }`}
    >
      {formatTime(elapsedTime)}
    </div>
  );
}
