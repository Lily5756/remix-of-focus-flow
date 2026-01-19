import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, BREAK_DURATION } from '@/types/focus';

interface UseTimerOptions {
  onFocusComplete: () => void;
  onBreakComplete: () => void;
}

export function useTimer({ onFocusComplete, onBreakComplete }: UseTimerOptions) {
  const [state, setState] = useState<TimerState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startFocus = useCallback((durationMinutes: number) => {
    clearTimer();
    const durationSeconds = durationMinutes * 60;
    setTimeRemaining(durationSeconds);
    setTotalDuration(durationSeconds);
    setState('focus');
  }, [clearTimer]);

  const startBreak = useCallback(() => {
    clearTimer();
    const durationSeconds = BREAK_DURATION * 60;
    setTimeRemaining(durationSeconds);
    setTotalDuration(durationSeconds);
    setState('break');
  }, [clearTimer]);

  const pause = useCallback(() => {
    if (state === 'focus') {
      setState('paused');
    }
  }, [state]);

  const resume = useCallback(() => {
    if (state === 'paused') {
      setState('focus');
    }
  }, [state]);

  const stop = useCallback(() => {
    clearTimer();
    setState('idle');
    setTimeRemaining(0);
    setTotalDuration(0);
  }, [clearTimer]);

  const skipBreak = useCallback(() => {
    if (state === 'break') {
      clearTimer();
      setState('idle');
      setTimeRemaining(0);
      setTotalDuration(0);
    }
  }, [state, clearTimer]);

  useEffect(() => {
    if (state === 'focus' || state === 'break') {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            if (state === 'focus') {
              onFocusComplete();
            } else {
              onBreakComplete();
              setState('idle');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [state, clearTimer, onFocusComplete, onBreakComplete]);

  const progress = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;

  return {
    state,
    timeRemaining,
    totalDuration,
    progress,
    startFocus,
    startBreak,
    pause,
    resume,
    stop,
    skipBreak,
  };
}
