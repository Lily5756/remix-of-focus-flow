import { Flame, Trophy } from 'lucide-react';
import { StreakData } from '@/types/focus';

interface StreakDisplayProps {
  streakData: StreakData;
}

export function StreakDisplay({ streakData }: StreakDisplayProps) {
  const { currentStreak, longestStreak, todaySessionCount } = streakData;
  
  if (currentStreak === 0 && todaySessionCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
      {currentStreak > 0 && (
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium">{currentStreak}</span>
          <span className="text-xs">day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
      )}
      {longestStreak > currentStreak && (
        <div className="flex items-center gap-1 opacity-70">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs">Best: {longestStreak}</span>
        </div>
      )}
      {todaySessionCount > 0 && (
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs">{todaySessionCount} today</span>
        </div>
      )}
    </div>
  );
}
