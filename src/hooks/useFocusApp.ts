import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useTimer } from './useTimer';
import { useSound } from './useSound';
import { Task, FocusSession, UserPreferences, StreakData, FOCUS_DURATIONS } from '@/types/focus';

const getToday = () => new Date().toISOString().split('T')[0];

const generateId = () => Math.random().toString(36).substring(2, 9);

const ENCOURAGEMENTS = [
  "Nice focus! 🌟",
  "Well done! ✨",
  "Great session! 💫",
  "You're doing great! 🎯",
  "Keep it up! 🌱",
];

export function useFocusApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('focus-tasks', []);
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>('focus-sessions', []);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('focus-preferences', {
    preferredDuration: 25,
    lastActiveTaskId: null,
    lastSessionDurations: [],
  });
  const [streakData, setStreakData] = useLocalStorage<StreakData>('focus-streak', {
    currentStreak: 0,
    lastActiveDate: '',
    todaySessionCount: 0,
  });
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(preferences.lastActiveTaskId);
  const [selectedDuration, setSelectedDuration] = useState(preferences.preferredDuration);
  const [showReflection, setShowReflection] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  
  const { playChime } = useSound();

  const handleFocusComplete = useCallback(() => {
    playChime();
    setShowReflection(true);
  }, [playChime]);

  const handleBreakComplete = useCallback(() => {
    playChime();
  }, [playChime]);

  const timer = useTimer({
    onFocusComplete: handleFocusComplete,
    onBreakComplete: handleBreakComplete,
  });

  const activeTask = useMemo(() => 
    tasks.find(t => t.id === activeTaskId) || null,
    [tasks, activeTaskId]
  );

  const incompleteTasks = useMemo(() => 
    tasks.filter(t => !t.isCompleted).sort((a, b) => b.createdAt - a.createdAt),
    [tasks]
  );

  const addTask = useCallback((text: string, scheduledDate: string | null = null) => {
    const newTask: Task = {
      id: generateId(),
      text: text.trim(),
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: Date.now(),
      scheduledDate,
    };
    setTasks(prev => [newTask, ...prev]);
    if (!scheduledDate) {
      setActiveTaskId(newTask.id);
      setPreferences(prev => ({ ...prev, lastActiveTaskId: newTask.id }));
    }
    return newTask;
  }, [setTasks, setPreferences]);

  const updateTaskDate = useCallback((taskId: string, scheduledDate: string | null) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, scheduledDate } : t
    ));
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
      setPreferences(prev => ({ ...prev, lastActiveTaskId: null }));
    }
  }, [activeTaskId, setTasks, setPreferences]);

  const allTasks = useMemo(() => tasks, [tasks]);

  const selectTask = useCallback((taskId: string) => {
    setActiveTaskId(taskId);
    setPreferences(prev => ({ ...prev, lastActiveTaskId: taskId }));
  }, [setPreferences]);

  const completeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, isCompleted: true } : t
    ));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
      setPreferences(prev => ({ ...prev, lastActiveTaskId: null }));
    }
  }, [activeTaskId, setTasks, setPreferences]);

  const updateDuration = useCallback((duration: number) => {
    setSelectedDuration(duration);
  }, []);

  const startSession = useCallback(() => {
    if (!activeTaskId) return;
    
    const sessionId = generateId();
    const newSession: FocusSession = {
      id: sessionId,
      taskId: activeTaskId,
      duration: selectedDuration,
      startedAt: Date.now(),
      completedAt: null,
      reflection: null,
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(sessionId);
    timer.startFocus(selectedDuration);
  }, [activeTaskId, selectedDuration, setSessions, timer]);

  const submitReflection = useCallback((answer: 'yes' | 'no') => {
    if (!currentSessionId) return;
    
    const today = getToday();
    
    // Update session with reflection
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, completedAt: Date.now(), reflection: answer }
        : s
    ));
    
    // Increment task pomodoro count
    if (activeTaskId) {
      setTasks(prev => prev.map(t => 
        t.id === activeTaskId 
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
          : t
      ));
    }
    
    // Update preferences with duration
    setPreferences(prev => {
      const durations = [...prev.lastSessionDurations, selectedDuration].slice(-5);
      const mostFrequent = durations.sort((a, b) =>
        durations.filter(v => v === a).length - durations.filter(v => v === b).length
      ).pop() || selectedDuration;
      
      return {
        ...prev,
        preferredDuration: mostFrequent,
        lastSessionDurations: durations,
      };
    });
    
    // Update streak
    setStreakData(prev => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = prev.currentStreak;
      let newTodayCount = prev.todaySessionCount;
      
      if (prev.lastActiveDate === today) {
        newTodayCount += 1;
      } else if (prev.lastActiveDate === yesterdayStr) {
        newStreak += 1;
        newTodayCount = 1;
      } else if (prev.lastActiveDate !== today) {
        newStreak = 1;
        newTodayCount = 1;
      }
      
      return {
        currentStreak: newStreak,
        lastActiveDate: today,
        todaySessionCount: newTodayCount,
      };
    });
    
    // Show encouragement
    const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setEncouragement(randomEncouragement);
    setTimeout(() => setEncouragement(null), 3000);
    
    setShowReflection(false);
    setCurrentSessionId(null);
    timer.startBreak();
  }, [currentSessionId, activeTaskId, selectedDuration, setSessions, setTasks, setPreferences, setStreakData, timer]);

  const skipReflection = useCallback(() => {
    setShowReflection(false);
    setCurrentSessionId(null);
    timer.startBreak();
  }, [timer]);

  const endSession = useCallback(() => {
    timer.stop();
    setCurrentSessionId(null);
  }, [timer]);

  return {
    // State
    tasks: incompleteTasks,
    allTasks,
    activeTask,
    activeTaskId,
    selectedDuration,
    timer,
    showReflection,
    streakData,
    encouragement,
    
    // Actions
    addTask,
    selectTask,
    completeTask,
    deleteTask,
    updateTaskDate,
    updateDuration,
    startSession,
    submitReflection,
    skipReflection,
    endSession,
  };
}
