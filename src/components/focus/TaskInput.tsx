import { useState, useCallback } from 'react';
import { Plus, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/focus';

interface TaskInputProps {
  tasks: Task[];
  activeTask: Task | null;
  onAddTask: (text: string) => void;
  onSelectTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  disabled?: boolean;
}

export function TaskInput({
  tasks,
  activeTask,
  onAddTask,
  onSelectTask,
  onCompleteTask,
  disabled
}: TaskInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText);
      setNewTaskText('');
      setIsAdding(false);
      setIsExpanded(false);
    }
  }, [newTaskText, onAddTask]);

  const handleSelectTask = useCallback((taskId: string) => {
    onSelectTask(taskId);
    setIsExpanded(false);
  }, [onSelectTask]);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Active task display - glassmorphism style */}
      <button
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={cn(
          "w-full px-5 py-4 rounded-2xl text-left transition-all duration-300",
          "border backdrop-blur-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled
            ? "opacity-60 cursor-not-allowed bg-card/40 border-border/40"
            : "bg-card/60 border-border/60 hover:bg-card/80 hover:border-border hover:shadow-lg"
        )}
        style={{
          boxShadow: disabled ? 'none' : '0 4px 20px hsl(var(--background) / 0.3), inset 0 1px 0 hsl(255 255 255 / 0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {activeTask ? (
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-foreground">{activeTask.text}</span>
                {activeTask.completedPomodoros > 0 && (
                  <span className="text-xs shrink-0 px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: 'hsl(var(--timer-accent) / 0.15)',
                      color: 'hsl(var(--timer-accent))',
                    }}
                  >
                    x{activeTask.completedPomodoros}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">What are you focusing on?</span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ml-2",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded task list - glassmorphism */}
      {isExpanded && (
        <div
          className="mt-3 rounded-2xl border border-border/60 overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--card) / 0.8) 0%, hsl(var(--card) / 0.6) 100%)',
            boxShadow: '0 8px 32px hsl(var(--background) / 0.4), inset 0 1px 0 hsl(255 255 255 / 0.05)'
          }}
        >
          {/* Add new task */}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="p-4 border-b border-border/40">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What will you focus on?"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--timer-accent))] focus:border-transparent transition-all"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium disabled:opacity-50 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--timer-accent)) 0%, hsl(var(--timer-accent) / 0.8) 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px hsl(var(--timer-accent) / 0.3)'
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskText('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-muted/60 text-muted-foreground font-medium hover:bg-muted transition-colors border border-border/40"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full px-5 py-4 flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300 border-b border-border/40"
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center transition-colors"
                style={{ borderColor: 'hsl(var(--timer-accent) / 0.5)' }}
              >
                <Plus className="w-3.5 h-3.5" style={{ color: 'hsl(var(--timer-accent))' }} />
              </div>
              <span className="font-medium">Add new task</span>
            </button>
          )}

          {/* Task list */}
          <div className="max-h-64 overflow-y-auto">
            {tasks.length === 0 && !isAdding ? (
              <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                No tasks yet. Add one to get started!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 border-b border-border/30 last:border-b-0 transition-all duration-300",
                    activeTask?.id === task.id && "bg-[hsl(var(--timer-accent)/0.1)]"
                  )}
                >
                  {/* Circular checkbox */}
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="w-6 h-6 rounded-full border-2 border-muted-foreground/40 hover:border-[hsl(var(--timer-accent))] hover:bg-[hsl(var(--timer-accent))] hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 group"
                  >
                    <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Task text */}
                  <button
                    onClick={() => handleSelectTask(task.id)}
                    className="flex-1 text-left truncate hover:text-foreground transition-colors font-medium"
                  >
                    {task.text}
                  </button>

                  {/* Pomodoro count */}
                  {task.completedPomodoros > 0 && (
                    <span
                      className="text-xs shrink-0 px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: 'hsl(var(--timer-accent) / 0.15)',
                        color: 'hsl(var(--timer-accent))',
                      }}
                    >
                      x{task.completedPomodoros}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
