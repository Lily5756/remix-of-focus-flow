import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const STREAK_MILESTONES = [7, 30, 100] as const;

export function useStreakCelebration() {
  const celebrate = useCallback((streakCount: number) => {
    // Check if this is a milestone
    if (!STREAK_MILESTONES.includes(streakCount as typeof STREAK_MILESTONES[number])) {
      return false;
    }

    // Fire confetti based on milestone level
    const duration = streakCount >= 100 ? 5000 : streakCount >= 30 ? 3000 : 2000;
    const particleCount = streakCount >= 100 ? 200 : streakCount >= 30 ? 150 : 100;

    // First burst
    confetti({
      particleCount: Math.floor(particleCount / 2),
      spread: 60,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500', '#DC143C'],
      startVelocity: 45,
      gravity: 1,
      ticks: 300,
    });

    // Side bursts for bigger milestones
    if (streakCount >= 30) {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(particleCount / 3),
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347'],
        });
        confetti({
          particleCount: Math.floor(particleCount / 3),
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6347'],
        });
      }, 250);
    }

    // Epic celebration for 100 days
    if (streakCount >= 100) {
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 30,
          angle: 60 + Math.random() * 60,
          spread: 45 + Math.random() * 30,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500', '#DC143C', '#9400D3'],
        });
      }, 150);
    }

    return true;
  }, []);

  return { celebrate };
}

export function getMilestoneMessage(streakCount: number): string | null {
  switch (streakCount) {
    case 7:
      return "🔥 1 Week Streak! You're on fire!";
    case 30:
      return "🏆 30 Day Streak! Incredible dedication!";
    case 100:
      return "👑 100 DAY STREAK! You're a legend!";
    default:
      return null;
  }
}
