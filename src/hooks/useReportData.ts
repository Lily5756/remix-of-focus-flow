import { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isWithinInterval,
  getDay
} from 'date-fns';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FocusSession, Task } from '@/types/focus';

export type TimeRange = 'weekly' | 'monthly' | 'yearly';

interface DayData {
  label: string;
  date: Date;
  minutes: number;
  sessions: number;
}

interface ReportData {
  totalMinutes: number;
  totalSessions: number;
  bestDay: { date: Date; minutes: number } | null;
  longestStreak: number;
  currentStreak: number;
  mostFocusedDayOfWeek: string | null;
  chartData: DayData[];
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useReportData(range: TimeRange): ReportData {
  const [sessions] = useLocalStorage<FocusSession[]>('focus-sessions', []);
  const [tasks] = useLocalStorage<Task[]>('focus-tasks', []);

  return useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (range) {
      case 'weekly':
        startDate = startOfWeek(now, { weekStartsOn: 0 });
        endDate = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
    }

    // Filter completed sessions within range
    const completedSessions = sessions.filter(s => {
      if (!s.completedAt) return false;
      const sessionDate = new Date(s.completedAt);
      return isWithinInterval(sessionDate, { start: startDate, end: endDate });
    });

    // Calculate totals
    const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = completedSessions.length;

    // Group by day for analysis
    const dayMap = new Map<string, { date: Date; minutes: number; sessions: number }>();
    
    completedSessions.forEach(session => {
      const date = new Date(session.completedAt!);
      const key = format(date, 'yyyy-MM-dd');
      const existing = dayMap.get(key) || { date, minutes: 0, sessions: 0 };
      dayMap.set(key, {
        date,
        minutes: existing.minutes + session.duration,
        sessions: existing.sessions + 1,
      });
    });

    // Find best day
    let bestDay: { date: Date; minutes: number } | null = null;
    dayMap.forEach(({ date, minutes }) => {
      if (!bestDay || minutes > bestDay.minutes) {
        bestDay = { date, minutes };
      }
    });

    // Calculate streaks (consecutive days with sessions)
    const sortedDays = Array.from(dayMap.keys()).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(sortedDays[i]);
        const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Check current streak
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
    if (dayMap.has(today) || dayMap.has(yesterday)) {
      currentStreak = 1;
      let checkDate = dayMap.has(today) ? new Date() : new Date(Date.now() - 86400000);
      
      while (true) {
        checkDate = new Date(checkDate.getTime() - 86400000);
        const checkKey = format(checkDate, 'yyyy-MM-dd');
        if (dayMap.has(checkKey)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Most focused day of week
    const dayOfWeekTotals = [0, 0, 0, 0, 0, 0, 0];
    dayMap.forEach(({ date, minutes }) => {
      dayOfWeekTotals[getDay(date)] += minutes;
    });
    
    const maxDayMinutes = Math.max(...dayOfWeekTotals);
    const mostFocusedDayOfWeek = maxDayMinutes > 0 
      ? WEEKDAY_NAMES[dayOfWeekTotals.indexOf(maxDayMinutes)]
      : null;

    // Generate chart data based on range
    let chartData: DayData[] = [];

    if (range === 'weekly') {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      chartData = days.map(date => {
        const key = format(date, 'yyyy-MM-dd');
        const dayData = dayMap.get(key);
        return {
          label: WEEKDAY_NAMES[getDay(date)],
          date,
          minutes: dayData?.minutes || 0,
          sessions: dayData?.sessions || 0,
        };
      });
    } else if (range === 'monthly') {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 0 });
      chartData = weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
        let weekMinutes = 0;
        let weekSessions = 0;
        
        dayMap.forEach(({ date, minutes, sessions }) => {
          if (isSameWeek(date, weekStart, { weekStartsOn: 0 })) {
            weekMinutes += minutes;
            weekSessions += sessions;
          }
        });
        
        return {
          label: `W${index + 1}`,
          date: weekStart,
          minutes: weekMinutes,
          sessions: weekSessions,
        };
      });
    } else {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      chartData = months.map(monthStart => {
        let monthMinutes = 0;
        let monthSessions = 0;
        
        dayMap.forEach(({ date, minutes, sessions }) => {
          if (isSameMonth(date, monthStart)) {
            monthMinutes += minutes;
            monthSessions += sessions;
          }
        });
        
        return {
          label: MONTH_NAMES[monthStart.getMonth()],
          date: monthStart,
          minutes: monthMinutes,
          sessions: monthSessions,
        };
      });
    }

    return {
      totalMinutes,
      totalSessions,
      bestDay,
      longestStreak,
      currentStreak,
      mostFocusedDayOfWeek,
      chartData,
    };
  }, [sessions, range]);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}
