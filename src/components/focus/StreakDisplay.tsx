import { Flame, Trophy, Frown } from 'lucide-react';
import { StreakData } from '@/types/focus';
import { useEffect, useState, useRef } from 'react';

interface StreakDisplayProps {
  streakData: StreakData;
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) {
    const messages = [
      "Start fresh today!",
      "Every journey begins with one step",
      "Today's the day to begin!",
      "Your comeback starts now",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  if (streak === 1) {
    return "Great start! Keep it going!";
  }
  if (streak < 7) {
    return `${streak} days strong! Building momentum`;
  }
  if (streak < 14) {
    return "One week warrior! You're unstoppable";
  }
  if (streak < 30) {
    return "Incredible focus! Keep crushing it";
  }
  if (streak < 100) {
    return "Legendary dedication!";
  }
  return "You're a focus master!";
}

export function StreakDisplay({ streakData }: StreakDisplayProps) {
  const { currentStreak, longestStreak, todaySessionCount } = streakData;
  const motivationalMessage = getMotivationalMessage(currentStreak);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevStreakRef = useRef(currentStreak);

  useEffect(() => {
    if (currentStreak > prevStreakRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = currentStreak;
  }, [currentStreak]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center justify-center gap-2 text-sm">
        <div
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
            isAnimating ? 'animate-[streak-pop_0.6s_ease-out]' : ''
          }`}
          style={{
            background: 'hsl(var(--card) / 0.6)',
            borderColor: currentStreak > 0 ? 'hsl(25 90% 50% / 0.3)' : 'hsl(var(--border) / 0.5)',
            boxShadow: currentStreak > 0
              ? '0 2px 12px hsl(25 90% 50% / 0.15), inset 0 1px 0 hsl(255 255 255 / 0.05)'
              : '0 2px 10px hsl(var(--background) / 0.3), inset 0 1px 0 hsl(255 255 255 / 0.05)'
          }}
        >
          {currentStreak > 0 ? (
            <>
              <Flame className={`w-4 h-4 text-orange-500 ${isAnimating ? 'animate-[streak-glow_0.6s_ease-out]' : ''}`} />
              <span className="font-semibold text-foreground">{currentStreak}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </>
          ) : (
            <>
              <Frown className="w-4 h-4 text-muted-foreground/70" />
              <span className="font-semibold text-muted-foreground">0</span>
              <span className="text-xs text-muted-foreground">streak</span>
            </>
          )}
        </div>
        {todaySessionCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border backdrop-blur-sm"
            style={{
              background: 'hsl(var(--timer-accent) / 0.1)',
              borderColor: 'hsl(var(--timer-accent) / 0.3)',
              boxShadow: '0 2px 10px hsl(var(--timer-accent) / 0.1), inset 0 1px 0 hsl(255 255 255 / 0.05)'
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'hsl(var(--timer-accent))' }}
            />
            <span className="text-xs font-medium text-foreground">{todaySessionCount} today</span>
          </div>
        )}
      </div>
      <p className={`text-xs text-muted-foreground/80 transition-opacity duration-300 ${
        isAnimating ? 'animate-fade-in' : ''
      }`}>{motivationalMessage}</p>
    </div>
  );
}
