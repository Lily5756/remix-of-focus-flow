import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RoomPetProps {
  petType: 'cat';
  isVisible: boolean;
}

type IdleAnimation = 'sleeping' | 'sitting' | 'stretching' | 'grooming' | 'playing';

const IDLE_ANIMATIONS: IdleAnimation[] = ['sleeping', 'sitting', 'stretching', 'grooming', 'playing'];

const ANIMATION_DURATION: Record<IdleAnimation, number> = {
  sleeping: 8000,
  sitting: 5000,
  stretching: 3000,
  grooming: 4000,
  playing: 3500,
};

const PET_EMOJIS: Record<IdleAnimation, string> = {
  sleeping: '😺',
  sitting: '🐱',
  stretching: '😸',
  grooming: '😽',
  playing: '😹',
};

export function RoomPet({ petType, isVisible }: RoomPetProps) {
  const [currentAnimation, setCurrentAnimation] = useState<IdleAnimation>('sitting');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const scheduleNextAnimation = () => {
      const duration = ANIMATION_DURATION[currentAnimation];
      
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
        
        setTimeout(() => {
          // Pick a random different animation
          const availableAnimations = IDLE_ANIMATIONS.filter(a => a !== currentAnimation);
          const nextAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
          setCurrentAnimation(nextAnimation);
          setIsTransitioning(false);
        }, 300);
      }, duration);

      return timeout;
    };

    const timeout = scheduleNextAnimation();
    return () => clearTimeout(timeout);
  }, [currentAnimation, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-2 right-2 z-10">
      <div 
        className={cn(
          "relative transition-all duration-300",
          isTransitioning && "opacity-0 scale-90",
          !isTransitioning && "opacity-100 scale-100"
        )}
      >
        {/* Pet container with animation */}
        <div 
          className={cn(
            "text-3xl select-none",
            currentAnimation === 'sleeping' && "animate-pet-sleep",
            currentAnimation === 'sitting' && "animate-pet-idle",
            currentAnimation === 'stretching' && "animate-pet-stretch",
            currentAnimation === 'grooming' && "animate-pet-groom",
            currentAnimation === 'playing' && "animate-pet-play",
          )}
        >
          {PET_EMOJIS[currentAnimation]}
        </div>
        
        {/* Status indicator */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className={cn(
            "text-xs bg-background/80 px-2 py-0.5 rounded-full text-muted-foreground",
            "opacity-0 transition-opacity duration-500",
            currentAnimation === 'sleeping' && "opacity-100"
          )}>
            💤
          </span>
          <span className={cn(
            "text-xs bg-background/80 px-2 py-0.5 rounded-full text-muted-foreground",
            "opacity-0 transition-opacity duration-500",
            currentAnimation === 'playing' && "opacity-100"
          )}>
            ✨
          </span>
        </div>
      </div>
    </div>
  );
}
