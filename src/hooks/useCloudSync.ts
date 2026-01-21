import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Task, FocusSession, UserPreferences, StreakData } from '@/types/focus';
import { RoomState, WELCOME_BONUS } from '@/types/room';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface CloudData {
  tasks: Task[];
  sessions: FocusSession[];
  preferences: UserPreferences;
  streakData: StreakData;
  roomState: RoomState;
  updatedAt: string;
}

interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  isOnline: boolean;
  error: string | null;
}

interface UseCloudSyncOptions {
  onDataRestored?: (data: CloudData) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredDuration: 25,
  lastActiveTaskId: null,
  lastSessionDurations: [],
  userName: null,
  avatarId: null,
  customAvatar: null,
};

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStreakDate: '',
  todaySessionCount: 0,
};

const DEFAULT_ROOM_STATE: RoomState = {
  focusPoints: WELCOME_BONUS,
  lifetimeFocusPoints: WELCOME_BONUS,
  totalCompletedPomodoros: 0,
  ownedItems: [],
  placedItems: [],
  hasClaimedWelcomeBonus: true,
  claimedRewards: [],
};

export function useCloudSync(options?: UseCloudSyncOptions) {
  const { user, isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    lastSyncedAt: null,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    error: null,
  });
  
  const pendingSyncRef = useRef<CloudData | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Sync pending data when coming back online
      if (pendingSyncRef.current && isAuthenticated) {
        syncToCloud(pendingSyncRef.current);
      }
    };
    
    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);

  // Sync data to cloud
  const syncToCloud = useCallback(async (data: CloudData): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    if (!navigator.onLine) {
      pendingSyncRef.current = data;
      return false;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // First check if record exists
      const { data: existing } = await supabase
        .from('user_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const syncData = {
        tasks: JSON.parse(JSON.stringify(data.tasks)) as Json,
        sessions: JSON.parse(JSON.stringify(data.sessions)) as Json,
        preferences: JSON.parse(JSON.stringify(data.preferences)) as Json,
        streak_data: JSON.parse(JSON.stringify(data.streakData)) as Json,
        room_state: JSON.parse(JSON.stringify(data.roomState)) as Json,
        last_synced_at: new Date().toISOString(),
      };

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_data')
          .update(syncData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_data')
          .insert({
            user_id: user.id,
            ...syncData,
          });

        if (error) throw error;
      }

      pendingSyncRef.current = null;
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date(),
        error: null,
      }));

      return true;
    } catch (err) {
      console.error('Sync error:', err);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Failed to sync',
      }));
      return false;
    }
  }, [isAuthenticated, user]);

  // Debounced sync (for frequent updates)
  const debouncedSync = useCallback((data: CloudData) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncToCloud(data);
    }, 2000); // 2 second debounce
  }, [syncToCloud]);

  // Restore data from cloud
  const restoreFromCloud = useCallback(async (): Promise<CloudData | null> => {
    if (!isAuthenticated || !user) {
      return null;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: data?.last_synced_at ? new Date(data.last_synced_at) : null,
      }));

      if (data) {
        const cloudData: CloudData = {
          tasks: Array.isArray(data.tasks) ? (data.tasks as unknown as Task[]) : [],
          sessions: Array.isArray(data.sessions) ? (data.sessions as unknown as FocusSession[]) : [],
          preferences: data.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences)
            ? { ...DEFAULT_PREFERENCES, ...(data.preferences as object) } as UserPreferences
            : DEFAULT_PREFERENCES,
          streakData: data.streak_data && typeof data.streak_data === 'object' && !Array.isArray(data.streak_data)
            ? { ...DEFAULT_STREAK_DATA, ...(data.streak_data as object) } as StreakData
            : DEFAULT_STREAK_DATA,
          roomState: data.room_state && typeof data.room_state === 'object' && !Array.isArray(data.room_state)
            ? { ...DEFAULT_ROOM_STATE, ...(data.room_state as object) } as RoomState
            : DEFAULT_ROOM_STATE,
          updatedAt: data.updated_at,
        };

        if (options?.onDataRestored) {
          options.onDataRestored(cloudData);
        }

        toast({
          title: "✅ Restored your progress",
          description: "Your data has been synced from the cloud.",
        });

        return cloudData;
      }

      return null;
    } catch (err) {
      console.error('Restore error:', err);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Failed to restore',
      }));
      return null;
    }
  }, [isAuthenticated, user, options]);

  // Check if cloud data exists
  const checkCloudData = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch {
      return false;
    }
  }, [isAuthenticated, user]);

  // Initialize cloud data from local state (for first-time sync)
  const initializeCloudData = useCallback(async (localData: CloudData): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    const hasCloudData = await checkCloudData();
    
    if (!hasCloudData) {
      return await syncToCloud(localData);
    }

    return false;
  }, [isAuthenticated, user, checkCloudData, syncToCloud]);

  // Manual sync now
  const syncNow = useCallback(async (data: CloudData): Promise<boolean> => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    return await syncToCloud(data);
  }, [syncToCloud]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    syncStatus,
    syncToCloud,
    debouncedSync,
    restoreFromCloud,
    checkCloudData,
    initializeCloudData,
    syncNow,
    isAuthenticated,
  };
}
