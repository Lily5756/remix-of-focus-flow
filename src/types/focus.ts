export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  notes: string; // Multi-line notes for the task
  checklist: ChecklistItem[]; // Quick checklist items
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
