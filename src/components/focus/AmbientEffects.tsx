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
    size: Math.random() * 6 + 3,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.2,
  }));
}

// Cozy Mode: Soft glowing orbs with warm aurora effect
function CozyParticles() {
  const orbs = useMemo(() => generateParticles(12), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft aurora gradient background */}
      <div
        className="absolute inset-0 animate-aurora-shift"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(35 70% 60% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(25 80% 55% / 0.06) 0%, transparent 50%)
          `,
        }}
      />
      {/* Floating soft orbs */}
      {orbs.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-gentle blur-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 4}px`,
            height: `${p.size * 4}px`,
            background: `radial-gradient(circle at 40% 40%, hsl(40 70% 70% / ${p.opacity * 0.6}), hsl(30 60% 50% / ${p.opacity * 0.2}) 60%, transparent 100%)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Tiny sparkle accents */}
      {orbs.slice(0, 6).map((p) => (
        <div
          key={`spark-${p.id}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${(p.x + 15) % 100}%`,
            top: `${(p.y + 20) % 100}%`,
            width: '3px',
            height: '3px',
            background: 'hsl(45 90% 80%)',
            boxShadow: '0 0 8px 2px hsl(45 80% 70% / 0.5)',
            animationDuration: `${p.duration * 0.4}s`,
            animationDelay: `${p.delay + 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// Locked-In Mode: Minimal geometric focus rings with subtle glow
function LockedInPulse({ isActive }: { isActive?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer breathing ring */}
      <div
        className={cn(
          "absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full opacity-0",
          isActive && "animate-breathe-ring"
        )}
        style={{
          border: '1px solid hsl(0 0% 50% / 0.12)',
          boxShadow: '0 0 40px hsl(0 0% 50% / 0.05)',
        }}
      />
      {/* Inner breathing ring */}
      <div
        className={cn(
          "absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full opacity-0",
          isActive && "animate-breathe-ring-delayed"
        )}
        style={{
          border: '1px solid hsl(0 0% 55% / 0.1)',
        }}
      />
      {/* Center subtle glow */}
      <div
        className={cn(
          "absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full transition-opacity duration-1000",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: 'radial-gradient(circle, hsl(0 0% 60% / 0.03) 0%, transparent 70%)',
        }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.15) 100%)',
        }}
      />
    </div>
  );
}

// Fresh Mode: Glass morphism bubbles with iridescent effect
function FreshBubbles() {
  const bubbles = useMemo(() => generateParticles(10), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft gradient waves */}
      <div
        className="absolute inset-0 animate-gradient-flow"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 10% 90%, hsl(175 50% 60% / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 90% 20%, hsl(200 60% 65% / 0.05) 0%, transparent 50%)
          `,
        }}
      />
      {/* Glass bubbles rising */}
      {bubbles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-rise-float backdrop-blur-[1px]"
          style={{
            left: `${p.x}%`,
            bottom: `-${p.size * 5}px`,
            width: `${p.size * 5}px`,
            height: `${p.size * 5}px`,
            background: `
              radial-gradient(circle at 30% 30%, hsl(180 60% 90% / ${p.opacity * 0.4}) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, hsl(200 50% 80% / ${p.opacity * 0.2}) 0%, transparent 50%),
              linear-gradient(135deg, hsl(175 50% 70% / ${p.opacity * 0.15}) 0%, hsl(195 60% 60% / ${p.opacity * 0.1}) 100%)
            `,
            border: `1px solid hsl(180 40% 70% / ${p.opacity * 0.3})`,
            boxShadow: `
              inset 0 0 ${p.size * 2}px hsl(180 50% 90% / 0.2),
              0 0 ${p.size * 3}px hsl(185 50% 60% / ${p.opacity * 0.2})
            `,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Floating light specks */}
      {bubbles.slice(0, 5).map((p) => (
        <div
          key={`speck-${p.id}`}
          className="absolute rounded-full animate-drift"
          style={{
            left: `${(p.x + 40) % 100}%`,
            top: `${p.y}%`,
            width: '4px',
            height: '4px',
            background: 'radial-gradient(circle, hsl(180 70% 85%) 0%, transparent 100%)',
            boxShadow: '0 0 10px 3px hsl(180 60% 70% / 0.3)',
            animationDuration: `${p.duration * 0.6}s`,
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
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-0 pointer-events-none transition-opacity duration-700",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      {mood === 'cozy' && <CozyParticles />}
      {mood === 'locked-in' && <LockedInPulse isActive={isActive} />}
      {mood === 'fresh' && <FreshBubbles />}
    </div>
  );
}
