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
  const isBreak = state === 'break';
  const isPaused = state === 'paused';
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Progress ring */}
      <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        {/* Progress circle */}
        {isActive && (
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isBreak ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className={cn(
              "transition-all duration-1000 ease-linear",
              isPaused && "opacity-50"
            )}
          />
        )}
      </svg>
      
      {/* Timer text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          "font-light tracking-tight",
          isActive ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl text-muted-foreground"
        )}>
          {formattedTime}
        </span>
        
        {isBreak && (
          <span className="text-sm text-muted-foreground mt-2">Take a break</span>
        )}
        
        {isPaused && (
          <span className="text-sm text-muted-foreground mt-2">Paused</span>
        )}
      </div>
    </div>
  );
}
