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
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            hasActiveTask
              ? "bg-foreground text-background hover:opacity-90 active:scale-95 shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Play className="w-7 h-7 ml-1" fill="currentColor" />
        </button>
      )}

      {isFocusing && (
        <>
          <button
            onClick={onStop}
            className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={onPause}
            className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
          >
            <Pause className="w-5 h-5" fill="currentColor" />
          </button>
        </>
      )}

      {isPaused && (
        <>
          <button
            onClick={onStop}
            className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={onResume}
            className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:opacity-90 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
        </>
      )}

      {isBreak && (
        <button
          onClick={onSkipBreak}
          className="px-6 py-3 rounded-2xl bg-muted text-muted-foreground flex items-center gap-2 hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
        >
          <SkipForward className="w-4 h-4" />
          <span className="text-sm font-medium">Skip break</span>
        </button>
      )}
    </div>
  );
}
