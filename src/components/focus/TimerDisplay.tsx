import { cn } from '@/lib/utils';
import { TimerState } from '@/types/focus';

interface TimerDisplayProps {
  timeRemaining: number;
  progress: number;
  state: TimerState;
}

export function TimerDisplay({ timeRemaining, progress, state }: TimerDisplayProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isActive = state === 'focus' || state === 'break' || state === 'paused';
  const isFocusing = state === 'focus';
  const isBreak = state === 'break';
  const isPaused = state === 'paused';

  // Calculate stroke dash for progress ring
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex items-center justify-center">
      {/* Soft glow effect when focusing */}
      {isFocusing && (
        <div
          className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-30 blur-3xl"
          style={{
            background: 'hsl(var(--timer-accent) / 0.4)',
          }}
        />
      )}

      {/* Progress ring container */}
      <div className="relative">
        <svg
          className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            className="mood-transition"
          />

          {/* Progress circle */}
          {isActive && (
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={isBreak ? "hsl(var(--muted-foreground))" : "hsl(var(--timer-accent))"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                "transition-all duration-1000 ease-linear",
                isPaused && "opacity-50"
              )}
            />
          )}
        </svg>

        {/* Timer text - centered in the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "font-light tracking-tight mood-transition transition-all duration-300",
            isActive
              ? "text-6xl sm:text-7xl text-foreground"
              : "text-5xl sm:text-6xl text-muted-foreground"
          )}>
            {formattedTime}
          </span>

          {/* Status text */}
          <span className={cn(
            "text-sm mt-2 mood-transition",
            isActive ? "text-muted-foreground" : "text-muted-foreground/60"
          )}>
            {isFocusing && "just focus"}
            {isBreak && "take a break"}
            {isPaused && "paused"}
            {!isActive && "ready to focus"}
          </span>
        </div>
      </div>
    </div>
  );
}
