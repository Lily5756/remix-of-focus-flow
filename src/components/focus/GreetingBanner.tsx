import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GreetingBannerProps {
  name: string;
  onDismiss: () => void;
}

export function GreetingBanner({ name, onDismiss }: GreetingBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Start fade out after 2 seconds
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 2000);
    
    // Dismiss after animation
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        isLeaving && "opacity-0"
      )}
    >
      <div 
        className={cn(
          "text-center px-6 transition-all duration-500",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          isLeaving && "translate-y-[-10px] opacity-0"
        )}
      >
        <p className="text-2xl sm:text-3xl font-semibold mb-2">
          Hi {name} <span className="inline-block animate-bounce">👋</span>
        </p>
        <p className="text-xl sm:text-2xl text-muted-foreground">
          Ready to lock in? <span className="inline-block animate-pulse">🔥</span>
        </p>
      </div>
    </div>
  );
}
