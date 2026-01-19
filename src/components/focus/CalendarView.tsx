import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FocusSession } from '@/types/focus';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions] = useLocalStorage<FocusSession[]>('focus-sessions', []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, FocusSession[]> = {};
    sessions.forEach(session => {
      if (session.completedAt) {
        const dateKey = format(new Date(session.completedAt), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(session);
      }
    });
    return grouped;
  }, [sessions]);

  const getSessionsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return sessionsByDate[dateKey] || [];
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={goToPreviousMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={goToToday}
          className="text-lg font-semibold hover:text-muted-foreground transition-colors"
        >
          {format(currentDate, 'MMMM yyyy')}
        </button>
        
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={index}
            className="h-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-2 flex-1">
        {calendarDays.map((day, index) => {
          const daySessions = getSessionsForDate(day);
          const hasSession = daySessions.length > 0;
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center relative transition-colors rounded-full mx-auto w-10 h-10",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && "hover:bg-muted",
                isSelected && "bg-foreground text-background hover:bg-foreground",
                isTodayDate && !isSelected && "ring-2 ring-foreground ring-inset"
              )}
            >
              <span className={cn(
                "text-sm",
                isTodayDate && !isSelected && "font-semibold"
              )}>
                {format(day, 'd')}
              </span>
              
              {/* Session indicator dots */}
              {hasSession && !isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {daySessions.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 h-1 rounded-full",
                        isCurrentMonth ? "bg-foreground" : "bg-muted-foreground/40"
                      )}
                    />
                  ))}
                </div>
              )}
              {hasSession && isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {daySessions.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-background" />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date details */}
      <div className="border-t border-border mt-4 px-4 py-4 min-h-[140px]">
        {selectedDate ? (
          <>
            <h3 className="font-medium mb-3">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {selectedDateSessions.length > 0 ? (
              <div className="space-y-2">
                {selectedDateSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted"
                  >
                    <div className="w-2 h-2 rounded-full bg-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.duration} min focus
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.completedAt && format(new Date(session.completedAt), 'h:mm a')}
                        {session.reflection && ` • ${session.reflection === 'yes' ? 'Completed' : 'In progress'}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No focus sessions</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Select a date to view sessions</p>
        )}
      </div>
    </div>
  );
}
