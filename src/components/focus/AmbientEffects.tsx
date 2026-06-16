import { useEffect, useState, useMemo, useCallback } from 'react';
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

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
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

function generateShootingStars(count: number): ShootingStar[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 60,
    startY: Math.random() * 40,
    duration: Math.random() * 1.5 + 0.8,
    delay: Math.random() * 8,
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

// Fresh Mode: Warm cozy theme with gentle floating particles
function FreshBubbles() {
  const stars = useMemo(() => generateParticles(25), []);
  const shootingStars = useMemo(() => generateShootingStars(3), []);
  const [activeShootingStars, setActiveShootingStars] = useState<ShootingStar[]>([]);

  // Periodically trigger shooting stars
  useEffect(() => {
    const triggerShootingStar = () => {
      const star = {
        id: Date.now(),
        startX: Math.random() * 50 + 10,
        startY: Math.random() * 30,
        duration: Math.random() * 1.2 + 0.6,
        delay: 0,
      };
      setActiveShootingStars(prev => [...prev, star]);

      // Remove after animation
      setTimeout(() => {
        setActiveShootingStars(prev => prev.filter(s => s.id !== star.id));
      }, star.duration * 1000 + 500);
    };

    // Initial shooting stars
    shootingStars.forEach((star, i) => {
      setTimeout(() => triggerShootingStar(), star.delay * 1000);
    });

    // Periodic shooting stars (less frequent for cozier feel)
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerShootingStar();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm nebula gradients */}
      <div
        className="absolute inset-0 animate-nebula"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, hsl(12 60% 35% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 70%, hsl(25 50% 30% / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 50%, hsl(15 45% 25% / 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Soft glowing particles */}
      {stars.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-star-twinkle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 0.5}px`,
            height: `${p.size * 0.5}px`,
            background: `radial-gradient(circle, hsl(30 60% 90%) 0%, hsl(20 50% 75% / 0.5) 50%, transparent 100%)`,
            boxShadow: `0 0 ${p.size}px hsl(12 60% 70% / ${p.opacity * 0.4})`,
            animationDuration: `${p.duration * 0.35}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars with warm coral trail */}
      {activeShootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, hsl(12 80% 70%), hsl(20 60% 55% / 0.5), transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 8px hsl(12 70% 60% / 0.5), 0 0 16px hsl(15 60% 50% / 0.25)',
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Floating coral particles */}
      {stars.slice(0, 6).map((p) => (
        <div
          key={`particle-${p.id}`}
          className="absolute rounded-full animate-drift"
          style={{
            left: `${(p.x + 30) % 100}%`,
            top: `${(p.y + 20) % 100}%`,
            width: `${p.size * 1.8}px`,
            height: `${p.size * 1.8}px`,
            background: `radial-gradient(circle, hsl(12 65% 60% / ${p.opacity * 0.35}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px hsl(15 55% 50% / ${p.opacity * 0.25})`,
            animationDuration: `${p.duration * 0.9}s`,
            animationDelay: `${p.delay + 1}s`,
          }}
        />
      ))}

      {/* Ambient warm glow orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, hsl(12 55% 45%) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-12"
        style={{
          right: '5%',
          bottom: '30%',
          background: 'radial-gradient(circle, hsl(25 45% 40%) 0%, transparent 70%)',
        }}
      />
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
