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
          "w-full px-4 py-3 rounded-2xl text-left transition-all",
          "border border-border bg-card",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-accent"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {activeTask ? (
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{activeTask.text}</span>
                {activeTask.completedPomodoros > 0 && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    ×{activeTask.completedPomodoros}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">What are you focusing on?</span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-2",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded task list */}
      {isExpanded && (
        <div className="mt-2 rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
          {/* Add new task */}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="p-3 border-b border-border">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What will you focus on?"
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex-1 px-3 py-2 rounded-lg bg-foreground text-background font-medium disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskText('');
                  }}
                  className="px-3 py-2 rounded-lg bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full px-4 py-3 flex items-center gap-2 text-muted-foreground hover:bg-accent transition-colors border-b border-border"
            >
              <Plus className="w-4 h-4" />
              <span>Add new task</span>
            </button>
          )}

          {/* Task list */}
          <div className="max-h-64 overflow-y-auto">
            {tasks.length === 0 && !isAdding ? (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                No tasks yet. Add one to get started!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b border-border last:border-b-0",
                    activeTask?.id === task.id && "bg-muted"
                  )}
                >
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-colors shrink-0"
                  >
                    <Check className="w-3 h-3 opacity-0 hover:opacity-100" />
                  </button>
                  <button
                    onClick={() => handleSelectTask(task.id)}
                    className="flex-1 text-left truncate hover:text-foreground transition-colors"
                  >
                    {task.text}
                  </button>
                  {task.completedPomodoros > 0 && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      ×{task.completedPomodoros}
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
