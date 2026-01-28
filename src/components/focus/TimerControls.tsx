import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimerState } from '@/types/focus';

interface TimerControlsProps {
  state: TimerState;
  hasActiveTask: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkipBreak: () => void;
}

export function TimerControls({
  state,
  hasActiveTask,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkipBreak,
}: TimerControlsProps) {
  const isIdle = state === 'idle';
  const isFocusing = state === 'focus';
  const isPaused = state === 'paused';
  const isBreak = state === 'break';

  return (
    <div className="flex items-center justify-center gap-4">
      {isIdle && (
        <button
          onClick={onStart}
          disabled={!hasActiveTask}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            hasActiveTask
              ? "hover:scale-105 active:scale-95"
              : "cursor-not-allowed opacity-50"
          )}
          style={hasActiveTask ? {
            background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
            color: 'white',
            boxShadow: '0 8px 24px hsl(var(--timer-accent) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.2)'
          } : {
            background: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          <Play className="w-7 h-7 ml-1" fill="currentColor" />
        </button>
      )}

      {isFocusing && (
        <>
          <button
            onClick={onStop}
            className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border backdrop-blur-sm"
            style={{
              background: 'hsl(var(--card) / 0.8)',
              borderColor: 'hsl(var(--border) / 0.5)',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 16px hsl(var(--background) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.05)'
            }}
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={onPause}
            className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border backdrop-blur-sm"
            style={{
              background: 'hsl(var(--card) / 0.8)',
              borderColor: 'hsl(var(--border) / 0.5)',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 16px hsl(var(--background) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.05)'
            }}
          >
            <Pause className="w-5 h-5" fill="currentColor" />
          </button>
        </>
      )}

      {isPaused && (
        <>
          <button
            onClick={onStop}
            className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border backdrop-blur-sm"
            style={{
              background: 'hsl(var(--card) / 0.8)',
              borderColor: 'hsl(var(--border) / 0.5)',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 16px hsl(var(--background) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.05)'
            }}
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={onResume}
            className="w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
              color: 'white',
              boxShadow: '0 8px 24px hsl(var(--timer-accent) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.2)'
            }}
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
        </>
      )}

      {isBreak && (
        <button
          onClick={onSkipBreak}
          className="px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border backdrop-blur-sm hover:scale-105 active:scale-95"
          style={{
            background: 'hsl(var(--card) / 0.6)',
            borderColor: 'hsl(var(--border) / 0.5)',
            color: 'hsl(var(--muted-foreground))',
            boxShadow: '0 4px 16px hsl(var(--background) / 0.3), inset 0 1px 0 hsl(255 255 255 / 0.05)'
          }}
        >
          <SkipForward className="w-4 h-4" />
          <span className="text-sm font-medium">Skip break</span>
        </button>
      )}
    </div>
  );
}
