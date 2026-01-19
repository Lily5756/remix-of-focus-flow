import { Flame } from 'lucide-react';
import { StreakData } from '@/types/focus';

interface StreakDisplayProps {
  streakData: StreakData;
}

export function StreakDisplay({ streakData }: StreakDisplayProps) {
  const { currentStreak, todaySessionCount } = streakData;
  
  if (currentStreak === 0 && todaySessionCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
      {currentStreak > 0 && (
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4" />
          <span>{currentStreak} day streak</span>
        </div>
      )}
      {todaySessionCount > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-xs">●</span>
          <span>{todaySessionCount} today</span>
        </div>
      )}
    </div>
  );
}
