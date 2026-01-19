import { useEffect, useState } from 'react';
import { Trophy, Flame, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MilestoneCelebrationProps {
  message: string | null;
}

export function MilestoneCelebration({ message }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  if (!message) return null;

  // Determine icon based on message content
  const getIcon = () => {
    if (message.includes('100')) return <Crown className="w-8 h-8 text-amber-400" />;
    if (message.includes('30')) return <Trophy className="w-8 h-8 text-amber-500" />;
    return <Flame className="w-8 h-8 text-orange-500" />;
  };

  const getGradient = () => {
    if (message.includes('100')) return 'from-amber-500/20 via-yellow-500/20 to-orange-500/20';
    if (message.includes('30')) return 'from-amber-500/15 via-orange-500/15 to-red-500/15';
    return 'from-orange-500/10 via-red-500/10 to-pink-500/10';
  };

  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-20 z-50 flex justify-center px-4",
        "animate-in fade-in slide-in-from-top-4 duration-500",
        !isVisible && "animate-out fade-out slide-out-to-top-4"
      )}
    >
      <div className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-2xl",
        "bg-gradient-to-r backdrop-blur-md border border-amber-500/30",
        "shadow-lg shadow-amber-500/20",
        getGradient()
      )}>
        <div className="animate-bounce">
          {getIcon()}
        </div>
        <span className="text-lg font-bold text-foreground">
          {message}
        </span>
      </div>
    </div>
  );
}
