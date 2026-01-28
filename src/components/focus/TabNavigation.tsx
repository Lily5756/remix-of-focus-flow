import { Timer, Music, Calendar, BarChart3, Plus } from 'lucide-react';
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
    { id: 'tasks' as Tab, label: 'Music', icon: Music },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
    { id: 'report' as Tab, label: 'Report', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="mx-4 mb-4">
        {/* Glassmorphism container */}
        <div
          className="relative flex items-center justify-between gap-2 px-3 py-3 rounded-2xl max-w-md mx-auto border border-white/10"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: `
              0 8px 32px hsl(var(--background) / 0.4),
              0 0 0 1px hsl(var(--border) / 0.1),
              inset 0 1px 0 hsl(255 255 255 / 0.05)
            `,
          }}
        >
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
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300",
                    isActive
                      ? "bg-card/80 text-foreground shadow-lg border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  )}
                  style={isActive ? {
                    boxShadow: '0 4px 12px hsl(var(--background) / 0.3), inset 0 1px 0 hsl(255 255 255 / 0.1)'
                  } : {}}
                >
                  <tab.icon className="w-4 h-4" />
                  {isActive && <span className="hidden sm:inline">{tab.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Timer display when active */}
          {isTimerActive && timerDisplay && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-border/30"
              style={{
                background: 'hsl(var(--card) / 0.6)',
                boxShadow: 'inset 0 1px 0 hsl(255 255 255 / 0.05)'
              }}
            >
              <Timer className="w-3.5 h-3.5 text-[hsl(var(--timer-accent))]" />
              <span className="text-foreground">{timerDisplay}</span>
            </div>
          )}

          {/* Add button - accent colored */}
          <button
            onClick={() => onTabChange('tasks')}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
              boxShadow: `
                0 4px 16px hsl(var(--timer-accent) / 0.4),
                inset 0 1px 0 hsl(255 255 255 / 0.2)
              `,
            }}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
