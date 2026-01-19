import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FocusSession } from '@/types/focus';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function StreakCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions] = useLocalStorage<FocusSession[]>('focus-sessions', []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get dates with completed sessions
  const completedDates = useMemo(() => {
    const dates = new Set<string>();
    sessions.forEach(session => {
      if (session.completedAt) {
        const dateKey = format(new Date(session.completedAt), 'yyyy-MM-dd');
        dates.add(dateKey);
      }
    });
    return dates;
  }, [sessions]);

  // Get session count per day for intensity
  const sessionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.completedAt) {
        const dateKey = format(new Date(session.completedAt), 'yyyy-MM-dd');
        counts[dateKey] = (counts[dateKey] || 0) + 1;
      }
    });
    return counts;
  }, [sessions]);

  const hasSession = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return completedDates.has(dateKey);
  };

  const getIntensity = (date: Date): 'none' | 'low' | 'medium' | 'high' => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const count = sessionCounts[dateKey] || 0;
    if (count === 0) return 'none';
    if (count === 1) return 'low';
    if (count <= 3) return 'medium';
    return 'high';
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Count completed days this month
  const completedDaysThisMonth = useMemo(() => {
    return calendarDays.filter(day => 
      isSameMonth(day, currentDate) && hasSession(day)
    ).length;
  }, [calendarDays, currentDate, completedDates]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium">Streak Calendar</span>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <span className="text-sm font-medium">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        
        <button
          onClick={goToNextMonth}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day, index) => (
          <div
            key={index}
            className="h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const intensity = getIntensity(day);

          return (
            <div
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center rounded-md text-xs transition-all",
                !isCurrentMonth && "opacity-30",
                intensity === 'none' && "bg-muted/30",
                intensity === 'low' && "bg-orange-500/30 text-orange-900 dark:text-orange-100",
                intensity === 'medium' && "bg-orange-500/60 text-orange-900 dark:text-orange-100",
                intensity === 'high' && "bg-orange-500 text-white font-medium",
                isTodayDate && "ring-2 ring-foreground ring-inset"
              )}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>{completedDaysThisMonth} days completed</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-muted/30" />
          <div className="w-3 h-3 rounded bg-orange-500/30" />
          <div className="w-3 h-3 rounded bg-orange-500/60" />
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}