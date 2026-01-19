import { useCallback, useRef } from 'react';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Gentle bell-like tone
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1.5);
      
      // Second softer tone for harmony
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      
      oscillator2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
      gainNode2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.25);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
      
      oscillator2.start(ctx.currentTime + 0.15);
      oscillator2.stop(ctx.currentTime + 1.8);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }, []);

  return { playChime };
}
