import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type MoodTheme = 'auto' | 'cozy' | 'locked-in' | 'fresh';

const MOOD_LABELS: Record<MoodTheme, string> = {
  auto: 'Auto (Time of Day)',
  cozy: 'Cozy Mode ☕',
  'locked-in': 'Locked-In Mode 🔒',
  fresh: 'Fresh Start Mode 🌤️',
};

const MOOD_DESCRIPTIONS: Record<MoodTheme, string> = {
  auto: 'Changes based on time of day',
  cozy: 'Warm, soft, comforting',
  'locked-in': 'Dark, focused, serious',
  fresh: 'Bright, clean, optimistic',
};

function getAutoMood(): Exclude<MoodTheme, 'auto'> {
  const hour = new Date().getHours();
  
  // Early morning (5-9): Fresh Start
  if (hour >= 5 && hour < 9) return 'fresh';
  // Morning to afternoon (9-17): Cozy
  if (hour >= 9 && hour < 17) return 'cozy';
  // Evening and night: Locked-In
  return 'locked-in';
}

export function useMoodTheme() {
  const [selectedMood, setSelectedMood] = useLocalStorage<MoodTheme>('focus-mood-theme', 'auto');

  const activeMood = selectedMood === 'auto' ? getAutoMood() : selectedMood;

  // Apply mood theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all mood classes first
    root.classList.remove('mood-cozy', 'mood-locked-in', 'mood-fresh');
    
    // Add the active mood class
    root.classList.add(`mood-${activeMood}`);
    
    // Store for CSS transitions
    root.style.setProperty('--mood-transition', '1');
    
    return () => {
      root.style.removeProperty('--mood-transition');
    };
  }, [activeMood]);

  const setMood = useCallback((mood: MoodTheme) => {
    setSelectedMood(mood);
  }, [setSelectedMood]);

  return {
    selectedMood,
    activeMood,
    setMood,
    moodLabels: MOOD_LABELS,
    moodDescriptions: MOOD_DESCRIPTIONS,
    allMoods: ['auto', 'cozy', 'locked-in', 'fresh'] as MoodTheme[],
  };
}
