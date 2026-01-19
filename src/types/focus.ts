export interface Task {
  id: string;
  text: string;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: number;
  scheduledDate: string | null; // Format: 'yyyy-MM-dd'
}

export interface FocusSession {
  id: string;
  taskId: string;
  duration: number;
  startedAt: number;
  completedAt: number | null;
  reflection: 'yes' | 'no' | null;
}

export interface UserPreferences {
  preferredDuration: number;
  lastActiveTaskId: string | null;
  lastSessionDurations: number[];
  userName: string | null;
}

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  todaySessionCount: number;
}

export type TimerState = 'idle' | 'focus' | 'paused' | 'break';

export const FOCUS_DURATIONS = [25, 30, 45] as const;
export const BREAK_DURATION = 5;
