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
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center justify-center gap-3 text-sm">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm transition-transform duration-300 ${
            isAnimating ? 'animate-[streak-pop_0.6s_ease-out]' : ''
          }`}
        >
          {currentStreak > 0 ? (
            <>
              <Flame className={`w-4 h-4 text-orange-500 ${isAnimating ? 'animate-[streak-glow_0.6s_ease-out]' : ''}`} />
              <span className="font-semibold text-foreground">{currentStreak}</span>
              <span className="text-xs text-muted-foreground">day{currentStreak !== 1 ? 's' : ''}</span>
            </>
          ) : (
            <>
              <Frown className="w-4 h-4 text-muted-foreground/70" />
              <span className="font-semibold text-muted-foreground">0</span>
              <span className="text-xs text-muted-foreground">streak</span>
            </>
          )}
        </div>
        {longestStreak > currentStreak && (
          <div className="flex items-center gap-1 opacity-70">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-muted-foreground">Best: {longestStreak}</span>
          </div>
        )}
        {todaySessionCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium">{todaySessionCount} today</span>
          </div>
        )}
      </div>
      <p className={`text-xs text-muted-foreground/80 transition-opacity duration-300 ${
        isAnimating ? 'animate-fade-in' : ''
      }`}>{motivationalMessage}</p>
    </div>
  );
}
