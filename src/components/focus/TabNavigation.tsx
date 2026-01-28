import { Timer, Calendar, ListTodo, BarChart3, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'focus' | 'tasks' | 'room' | 'calendar' | 'report' | 'settings';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  timerDisplay?: string;
  isTimerActive?: boolean;
}

export function TabNavigation({ activeTab, onTabChange, timerDisplay, isTimerActive }: TabNavigationProps) {
  const tabs = [
    { id: 'focus' as Tab, label: 'Focus', icon: Timer },
    { id: 'tasks' as Tab, label: 'Tasks', icon: ListTodo },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
    { id: 'report' as Tab, label: 'Report', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between gap-2 px-2 py-2 bg-foreground rounded-full shadow-xl max-w-md mx-auto">
          {/* Main tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id ||
                (tab.id === 'focus' && ['room', 'settings'].includes(activeTab));

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-background/70 hover:text-background"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {isActive && <span className="hidden sm:inline">{tab.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Timer display when active */}
          {isTimerActive && timerDisplay && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-background text-foreground text-xs font-medium">
              <Timer className="w-3.5 h-3.5" />
              <span>{timerDisplay}</span>
            </div>
          )}

          {/* Add button */}
          <button
            onClick={() => onTabChange('tasks')}
            className="w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
