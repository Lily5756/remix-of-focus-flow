import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useTimer } from './useTimer';
import { useSound } from './useSound';
import { useStreakCelebration, getMilestoneMessage, STREAK_MILESTONES } from './useStreakCelebration';
import { useRoomBuilder } from './useRoomBuilder';
import { useCloudSync, CloudData } from './useCloudSync';
import { useAuth } from './useAuth';
import { Task, FocusSession, UserPreferences, StreakData, FOCUS_DURATIONS } from '@/types/focus';
import { PointsEarned, RoomState, WELCOME_BONUS } from '@/types/room';

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
    userName: null,
    avatarId: null,
    customAvatar: null,
  });
  const [streakData, setStreakData] = useLocalStorage<StreakData>('focus-streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastStreakDate: '',
    todaySessionCount: 0,
  });
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(preferences.lastActiveTaskId);
  const [selectedDuration, setSelectedDuration] = useState(preferences.preferredDuration);
  const [showReflection, setShowReflection] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [lastPointsEarned, setLastPointsEarned] = useState<PointsEarned | null>(null);
  
  const { playChime } = useSound();
  const { celebrate } = useStreakCelebration();
  const roomBuilder = useRoomBuilder();
  const { user, isAuthenticated } = useAuth();

  // Cloud sync - restore data when user logs in
  const handleDataRestored = useCallback((data: CloudData) => {
    if (data.tasks && data.tasks.length > 0) {
      setTasks(data.tasks);
    }
    if (data.sessions && data.sessions.length > 0) {
      setSessions(data.sessions);
    }
    if (data.preferences && Object.keys(data.preferences).length > 0) {
      setPreferences(data.preferences);
      if (data.preferences.userName) {
        // Update local state
      }
    }
    if (data.streakData && Object.keys(data.streakData).length > 0) {
      setStreakData(data.streakData);
    }
  }, [setTasks, setSessions, setPreferences, setStreakData]);

  const cloudSync = useCloudSync({ onDataRestored: handleDataRestored });

  // Build current data for syncing
  const buildSyncData = useCallback((): CloudData => ({
    tasks,
    sessions,
    preferences,
    streakData,
    roomState: {
      focusPoints: roomBuilder.focusPoints,
      lifetimeFocusPoints: roomBuilder.lifetimeFocusPoints,
      totalCompletedPomodoros: roomBuilder.totalCompletedPomodoros,
      ownedItems: roomBuilder.ownedItems,
      placedItems: roomBuilder.placedItems,
      hasClaimedWelcomeBonus: true,
      claimedRewards: roomBuilder.claimedRewards,
    },
    updatedAt: new Date().toISOString(),
  }), [tasks, sessions, preferences, streakData, roomBuilder]);

  // Auto-sync when authenticated and data changes
  useEffect(() => {
    if (isAuthenticated && user) {
      cloudSync.debouncedSync(buildSyncData());
    }
  }, [tasks, sessions, preferences, streakData, roomBuilder.focusPoints, roomBuilder.ownedItems, roomBuilder.placedItems, isAuthenticated, user]);

  // Check and restore cloud data on login
  useEffect(() => {
    if (isAuthenticated && user) {
      cloudSync.checkCloudData().then(hasData => {
        if (hasData) {
          cloudSync.restoreFromCloud();
        } else {
          // Initialize cloud with local data
          cloudSync.initializeCloudData(buildSyncData());
        }
      });
    }
  }, [isAuthenticated, user?.id]);

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
      notes: '',
      checklist: [],
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

  const updateTaskNotes = useCallback((taskId: string, notes: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, notes } : t
    ));
  }, [setTasks]);

  const updateTaskChecklist = useCallback((taskId: string, checklist: Task['checklist']) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, checklist } : t
    ));
  }, [setTasks]);

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
    const didReflect = answer === 'yes';
    
    // Award Focus Points
    const pointsEarned = roomBuilder.awardPoints(didReflect);
    setLastPointsEarned(pointsEarned);
    setTimeout(() => setLastPointsEarned(null), 4000);
    
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
    
    // Update streak and check for milestones
    let newStreakValue = 0;
    
    setStreakData(prev => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = prev.currentStreak;
      let newTodayCount = prev.todaySessionCount;
      
      if (prev.lastStreakDate === today) {
        // Same day - just increment session count
        newTodayCount += 1;
      } else if (prev.lastStreakDate === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak += 1;
        newTodayCount = 1;
      } else {
        // Missed a day or first session ever - reset streak to 1
        newStreak = 1;
        newTodayCount = 1;
      }
      
      // Update longest streak if current exceeds it
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      
      // Store new streak for milestone check
      newStreakValue = newStreak;
      
      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastStreakDate: today,
        todaySessionCount: newTodayCount,
      };
    });
    
    // Check for milestone celebration (delay slightly to ensure state is updated)
    setTimeout(() => {
      if (STREAK_MILESTONES.includes(newStreakValue as typeof STREAK_MILESTONES[number])) {
        celebrate(newStreakValue);
        const message = getMilestoneMessage(newStreakValue);
        if (message) {
          setMilestoneMessage(message);
          setTimeout(() => setMilestoneMessage(null), 5000);
        }
      } else {
        // Show regular encouragement
        const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setEncouragement(randomEncouragement);
        setTimeout(() => setEncouragement(null), 3000);
      }
    }, 100);
    
    setShowReflection(false);
    setCurrentSessionId(null);
    timer.startBreak();
  }, [currentSessionId, activeTaskId, selectedDuration, setSessions, setTasks, setPreferences, setStreakData, timer, celebrate, roomBuilder]);

  const skipReflection = useCallback(() => {
    // Award points even when skipping (no reflection bonus)
    const pointsEarned = roomBuilder.awardPoints(false);
    setLastPointsEarned(pointsEarned);
    setTimeout(() => setLastPointsEarned(null), 4000);
    
    setShowReflection(false);
    setCurrentSessionId(null);
    timer.startBreak();
  }, [timer, roomBuilder]);

  const endSession = useCallback(() => {
    timer.stop();
    setCurrentSessionId(null);
  }, [timer]);

  const userName = preferences.userName;
  const avatarId = preferences.avatarId;
  const customAvatar = preferences.customAvatar;

  const setUserName = useCallback((name: string) => {
    setPreferences(prev => ({ ...prev, userName: name }));
  }, [setPreferences]);

  const setAvatarId = useCallback((id: string | null) => {
    setPreferences(prev => ({ ...prev, avatarId: id, customAvatar: null }));
  }, [setPreferences]);

  const setCustomAvatar = useCallback((dataUrl: string) => {
    setPreferences(prev => ({ ...prev, customAvatar: dataUrl, avatarId: null }));
  }, [setPreferences]);

  // Sync functions for settings
  const syncNow = useCallback(async () => {
    await cloudSync.syncNow(buildSyncData());
  }, [cloudSync, buildSyncData]);

  const restoreFromCloud = useCallback(async () => {
    await cloudSync.restoreFromCloud();
  }, [cloudSync]);

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
    milestoneMessage,
    userName,
    avatarId,
    customAvatar,
    lastPointsEarned,
    
    // Room Builder
    roomBuilder,
    
    // Cloud Sync
    syncStatus: cloudSync.syncStatus,
    syncNow,
    restoreFromCloud,
    
    // Actions
    addTask,
    selectTask,
    completeTask,
    deleteTask,
    updateTaskDate,
    updateTaskNotes,
    updateTaskChecklist,
    updateDuration,
    startSession,
    submitReflection,
    skipReflection,
    endSession,
    setUserName,
    setAvatarId,
    setCustomAvatar,
  };
}
