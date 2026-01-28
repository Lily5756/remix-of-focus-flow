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
      {/* Active task display */}
      <button
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={cn(
          "w-full px-5 py-4 rounded-2xl text-left transition-all",
          "bg-card border border-border shadow-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:border-muted-foreground/20"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {activeTask ? (
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-foreground">{activeTask.text}</span>
                {activeTask.completedPomodoros > 0 && (
                  <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-full">
                    x{activeTask.completedPomodoros}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">What are you focusing on?</span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform shrink-0 ml-2",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded task list */}
      {isExpanded && (
        <div className="mt-3 rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
          {/* Add new task */}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="p-4 border-b border-border">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What will you focus on?"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium disabled:opacity-50 transition-opacity"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskText('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full px-5 py-4 flex items-center gap-3 text-muted-foreground hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
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
                    "flex items-center gap-3 px-5 py-4 border-b border-border last:border-b-0 transition-colors",
                    activeTask?.id === task.id && "bg-accent/50"
                  )}
                >
                  {/* Circular checkbox */}
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="w-6 h-6 rounded-full border-2 border-muted-foreground/40 hover:border-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-all shrink-0 group"
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
                    <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-full">
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
