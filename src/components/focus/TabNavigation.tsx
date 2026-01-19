import { Timer, Calendar, ListTodo, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'focus' | 'calendar' | 'tasks' | 'report' | 'settings';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'focus' as Tab, label: 'Focus', icon: Timer },
    { id: 'tasks' as Tab, label: 'Tasks', icon: ListTodo },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
    { id: 'report' as Tab, label: 'Report', icon: BarChart3 },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex items-center justify-center gap-0.5 p-1 bg-muted rounded-full overflow-x-auto max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center justify-center gap-1 px-2.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
