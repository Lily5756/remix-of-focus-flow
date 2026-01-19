import { Timer, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'focus' | 'calendar';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-full">
      <button
        onClick={() => onTabChange('focus')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          activeTab === 'focus'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Timer className="w-4 h-4" />
        <span>Focus</span>
      </button>
      <button
        onClick={() => onTabChange('calendar')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          activeTab === 'calendar'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Calendar className="w-4 h-4" />
        <span>Calendar</span>
      </button>
    </div>
  );
}
