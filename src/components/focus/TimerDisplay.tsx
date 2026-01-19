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
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsing glow ring when focusing */}
      {isFocusing && (
        <>
          <div 
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full animate-timer-pulse-outer"
            style={{ 
              background: 'radial-gradient(circle, transparent 60%, hsl(var(--timer-accent) / 0.15) 100%)',
            }}
          />
          <div 
            className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full animate-timer-pulse-inner"
            style={{ 
              boxShadow: '0 0 40px 10px hsl(var(--timer-accent) / 0.2)',
            }}
          />
        </>
      )}
      
      {/* Subtle glow effect behind timer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn(
            "w-56 h-56 rounded-full blur-3xl transition-all duration-700",
            isFocusing ? "opacity-50 scale-110" : isActive ? "opacity-30" : "opacity-0"
          )}
          style={{ background: `hsl(var(--glow-color))` }}
        />
      </div>
      
      {/* Progress ring */}
      <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 relative z-10" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="4"
          className="mood-transition"
        />
        {/* Outer glow ring when focusing */}
        {isFocusing && (
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="hsl(var(--timer-accent) / 0.3)"
            strokeWidth="2"
            className="animate-timer-glow"
          />
        )}
        {/* Progress circle */}
        {isActive && (
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isBreak ? "hsl(var(--muted-foreground))" : "hsl(var(--timer-accent))"}
            strokeWidth={isFocusing ? "5" : "4"}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className={cn(
              "transition-all duration-1000 ease-linear",
              isPaused && "opacity-50",
              isFocusing && "drop-shadow-[0_0_8px_hsl(var(--timer-accent)/0.6)]"
            )}
          />
        )}
      </svg>
      
      {/* Timer text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className={cn(
          "font-light tracking-tight mood-transition transition-all duration-300",
          isFocusing ? "text-6xl sm:text-7xl scale-105" : 
          isActive ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl text-muted-foreground"
        )}>
          {formattedTime}
        </span>
        
        {isFocusing && (
          <span className="text-sm text-muted-foreground mt-2 mood-transition animate-pulse">
            Focusing...
          </span>
        )}
        
        {isBreak && (
          <span className="text-sm text-muted-foreground mt-2 mood-transition">Take a break</span>
        )}
        
        {isPaused && (
          <span className="text-sm text-muted-foreground mt-2 mood-transition">Paused</span>
        )}
      </div>
    </div>
  );
}
