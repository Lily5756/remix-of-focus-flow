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
      {/* Ambient glow effect - always visible but stronger when focusing */}
      <div
        className={cn(
          "absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl transition-opacity duration-700",
          isFocusing ? "opacity-50" : "opacity-20"
        )}
        style={{
          background: 'radial-gradient(circle, hsl(var(--timer-accent) / 0.6) 0%, hsl(var(--timer-accent) / 0.2) 40%, transparent 70%)',
        }}
      />

      {/* Progress ring container */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isActive ? "opacity-100" : "opacity-40"
          )}
          style={{
            background: 'transparent',
            boxShadow: `
              0 0 60px 10px hsl(var(--timer-accent) / 0.15),
              inset 0 0 60px 10px hsl(var(--timer-accent) / 0.05)
            `,
          }}
        />

        <svg
          className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 relative z-10"
          viewBox="0 0 200 200"
        >
          {/* Glow filter for progress ring */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--timer-accent))" />
              <stop offset="50%" stopColor="hsl(var(--timer-accent) / 0.9)" />
              <stop offset="100%" stopColor="hsl(var(--timer-accent) / 0.7)" />
            </linearGradient>
          </defs>

          {/* Background circle - subtle border */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--muted) / 0.5)"
            strokeWidth="4"
            className="mood-transition"
          />

          {/* Inner dark fill for depth */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="hsl(var(--background) / 0.8)"
            className="mood-transition"
          />

          {/* Progress circle with glow */}
          {isActive && (
            <>
              {/* Glow layer */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="hsl(var(--timer-accent))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                filter="url(#glow)"
                className={cn(
                  "transition-all duration-1000 ease-linear",
                  isPaused && "opacity-30"
                )}
                style={{ opacity: isBreak ? 0.3 : 0.6 }}
              />
              {/* Main progress stroke */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke={isBreak ? "hsl(var(--muted-foreground))" : "url(#progressGradient)"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  "transition-all duration-1000 ease-linear",
                  isPaused && "opacity-50"
                )}
              />
              {/* Bright tip indicator */}
              {!isPaused && progress > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="hsl(var(--timer-accent))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`3 ${circumference - 3}`}
                  strokeDashoffset={strokeDashoffset}
                  filter="url(#glow)"
                  className="transition-all duration-1000 ease-linear"
                  style={{
                    filter: 'drop-shadow(0 0 8px hsl(var(--timer-accent)))',
                  }}
                />
              )}
            </>
          )}
        </svg>

        {/* Timer text - centered in the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className={cn(
            "font-extralight tracking-tight mood-transition transition-all duration-300",
            isActive
              ? "text-6xl sm:text-7xl text-foreground drop-shadow-[0_0_10px_hsl(var(--timer-accent)/0.3)]"
              : "text-5xl sm:text-6xl text-muted-foreground"
          )}>
            {formattedTime}
          </span>

          {/* Status text */}
          <span className={cn(
            "text-sm mt-3 font-medium tracking-wide mood-transition",
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
