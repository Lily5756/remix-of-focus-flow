import { Flame, Trophy, Frown } from 'lucide-react';
import { StreakData } from '@/types/focus';

interface StreakDisplayProps {
  streakData: StreakData;
}

export function StreakDisplay({ streakData }: StreakDisplayProps) {
  const { currentStreak, longestStreak, todaySessionCount } = streakData;

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        {currentStreak > 0 ? (
          <>
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{currentStreak}</span>
            <span className="text-xs">day{currentStreak !== 1 ? 's' : ''}</span>
          </>
        ) : (
          <>
            <Frown className="w-4 h-4 text-muted-foreground/70" />
            <span className="font-medium">0</span>
            <span className="text-xs">streak</span>
          </>
        )}
      </div>
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
