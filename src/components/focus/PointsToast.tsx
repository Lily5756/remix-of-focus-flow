import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PointsEarned } from '@/types/room';

interface PointsToastProps {
  points: PointsEarned | null;
}

export function PointsToast({ points }: PointsToastProps) {
  const [visible, setVisible] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<PointsEarned | null>(null);

  useEffect(() => {
    if (points) {
      setCurrentPoints(points);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [points]);

  if (!visible || !currentPoints) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6" />
          <div className="flex flex-col">
            <span className="font-bold text-lg">+{currentPoints.total} Focus Points</span>
            <div className="flex gap-2 text-xs opacity-90">
              <span>+{currentPoints.base} session</span>
              {currentPoints.reflectionBonus > 0 && (
                <span>+{currentPoints.reflectionBonus} reflection ✨</span>
              )}
              {currentPoints.firstOfDayBonus > 0 && (
                <span>+{currentPoints.firstOfDayBonus} first today 🌅</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
