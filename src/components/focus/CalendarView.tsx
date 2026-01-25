import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FocusSession, Task } from '@/types/focus';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions] = useLocalStorage<FocusSession[]>('focus-sessions', []);
  const [tasks] = useLocalStorage<Task[]>('focus-tasks', []);

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

  // Group tasks by scheduled date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (task.scheduledDate && !task.isCompleted) {
        if (!grouped[task.scheduledDate]) {
          grouped[task.scheduledDate] = [];
        }
        grouped[task.scheduledDate].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const getSessionsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return sessionsByDate[dateKey] || [];
  };

  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="flex flex-col h-full px-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
      {/* Month header */}
      <div className="flex items-center justify-between py-3">
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
          const dayTasks = getTasksForDate(day);
          const hasContent = daySessions.length > 0 || dayTasks.length > 0;
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
              
              {/* Indicator dots */}
              {hasContent && !isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayTasks.length > 0 && (
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      isCurrentMonth ? "bg-muted-foreground" : "bg-muted-foreground/40"
                    )} />
                  )}
                  {daySessions.slice(0, 2).map((_, i) => (
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
              {hasContent && isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayTasks.length > 0 && (
                    <div className="w-1 h-1 rounded-full bg-background/60" />
                  )}
                  {daySessions.slice(0, 2).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-background" />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date details */}
      <div className="border-t border-border mt-4 py-4 min-h-[180px] max-h-[240px] overflow-y-auto">
        {selectedDate ? (
          <>
            <h3 className="font-medium mb-3">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {/* Scheduled tasks */}
            {selectedDateTasks.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Scheduled Tasks</p>
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                      <p className="text-sm truncate flex-1">{task.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed sessions */}
            {selectedDateSessions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Focus Sessions</p>
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
              </div>
            )}

            {selectedDateTasks.length === 0 && selectedDateSessions.length === 0 && (
              <p className="text-sm text-muted-foreground">No tasks or sessions</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Select a date to view details</p>
        )}
      </div>
      </div>
    </div>
  );
}
