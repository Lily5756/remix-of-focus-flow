import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MoodTheme } from '@/hooks/useMoodTheme';

interface AmbientEffectsProps {
  mood: Exclude<MoodTheme, 'auto'>;
  isActive?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4, // Bigger particles (4-12px)
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.4 + 0.2, // Higher opacity (0.2-0.6)
  }));
}

// Cozy Mode: Floating dust motes in warm sunlight
function CozyParticles() {
  const particles = useMemo(() => generateParticles(20), []); // More particles

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-cozy"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, hsl(35 70% 65% / ${p.opacity}) 0%, hsl(30 60% 55% / ${p.opacity * 0.5}) 100%)`,
            boxShadow: `0 0 ${p.size * 2}px hsl(35 60% 60% / ${p.opacity * 0.6})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Locked-In Mode: Pulsing concentric rings
function LockedInPulse({ isActive }: { isActive?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer pulse ring */}
      <div
        className={cn(
          "absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border opacity-0",
          isActive && "animate-pulse-ring"
        )}
        style={{
          borderColor: 'hsl(0 0% 40% / 0.15)',
          borderWidth: '1px',
        }}
      />
      {/* Middle pulse ring */}
      <div
        className={cn(
          "absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border opacity-0",
          isActive && "animate-pulse-ring-delayed"
        )}
        style={{
          borderColor: 'hsl(0 0% 50% / 0.1)',
          borderWidth: '1px',
        }}
      />
      {/* Subtle corner vignette for focus */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsl(0 0% 0% / 0.2) 100%)',
        }}
      />
    </div>
  );
}

// Fresh Start Mode: Gentle floating bubbles/orbs - MORE VISIBLE on light backgrounds
function FreshBubbles() {
  const bubbles = useMemo(() => generateParticles(18), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-fresh"
          style={{
            left: `${p.x}%`,
            bottom: `-${p.size * 2}px`,
            width: `${p.size * 3}px`,
            height: `${p.size * 3}px`,
            // Use darker, more saturated colors for visibility on light backgrounds
            background: `radial-gradient(circle at 30% 30%, hsl(175 60% 55% / ${p.opacity + 0.25}), hsl(190 50% 45% / ${p.opacity + 0.1}))`,
            boxShadow: `0 0 ${p.size * 4}px hsl(180 50% 50% / ${p.opacity * 0.5})`,
            animationDuration: `${p.duration + 5}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Subtle floating sparkles */}
      {bubbles.slice(0, 8).map((p) => (
        <div
          key={`sparkle-${p.id}`}
          className="absolute animate-float-cozy"
          style={{
            left: `${(p.x + 30) % 100}%`,
            top: `${p.y}%`,
            width: `${p.size * 0.8}px`,
            height: `${p.size * 0.8}px`,
            background: `radial-gradient(circle, hsl(50 80% 70% / ${p.opacity + 0.2}) 0%, transparent 70%)`,
            animationDuration: `${p.duration * 0.8}s`,
            animationDelay: `${p.delay + 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export function AmbientEffects({ mood, isActive }: AmbientEffectsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount for smooth entrance
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-0 pointer-events-none transition-opacity duration-500",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      {mood === 'cozy' && <CozyParticles />}
      {mood === 'locked-in' && <LockedInPulse isActive={isActive} />}
      {mood === 'fresh' && <FreshBubbles />}
    </div>
  );
}
