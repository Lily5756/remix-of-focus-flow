import { Timer, Calendar, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'focus' | 'calendar' | 'tasks';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'focus' as Tab, label: 'Focus', icon: Timer },
    { id: 'tasks' as Tab, label: 'Tasks', icon: ListTodo },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
