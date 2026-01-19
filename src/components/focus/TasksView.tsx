import { useState } from 'react';
import { Plus, Calendar, Check, Trash2, X, FileText } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/types/focus';
import { TaskDetailModal } from './TaskDetailModal';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (text: string, scheduledDate: string | null) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskDate: (taskId: string, scheduledDate: string | null) => void;
  onUpdateTaskNotes?: (taskId: string, notes: string) => void;
  onUpdateTaskChecklist?: (taskId: string, checklist: Task['checklist']) => void;
}

export function TasksView({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onUpdateTaskDate,
  onUpdateTaskNotes,
  onUpdateTaskChecklist,
}: TasksViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskDate || null);
      setNewTaskText('');
      setNewTaskDate('');
      setIsAdding(false);
    }
  };

  const formatTaskDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    const date = parseISO(dateStr);
    return isPast(date) && !isToday(date);
  };

  // Sort tasks: overdue first, then by date, then unscheduled
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    if (!a.scheduledDate && !b.scheduledDate) return b.createdAt - a.createdAt;
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return a.scheduledDate.localeCompare(b.scheduledDate);
  });

  const incompleteTasks = sortedTasks.filter(t => !t.isCompleted);
  const completedTasks = sortedTasks.filter(t => t.isCompleted);

  return (
    <div className="flex flex-col h-full px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add task form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-2xl bg-card border border-border mood-transition">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What do you need to focus on?"
            autoFocus
            maxLength={200}
            className="w-full px-3 py-2 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-3 mood-transition"
          />
          
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="flex-1 px-3 py-2 rounded-lg bg-muted border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm mood-transition"
            />
            {newTaskDate && (
              <button
                type="button"
                onClick={() => setNewTaskDate('')}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newTaskText.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-foreground text-background font-medium disabled:opacity-50 mood-transition"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTaskText('');
                setNewTaskDate('');
              }}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground mood-transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {incompleteTasks.length === 0 && !isAdding ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tasks yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-sm text-foreground underline underline-offset-4"
            >
              Add your first task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {incompleteTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border mood-transition"
              >
                <button
                  onClick={() => onCompleteTask(task.id)}
                  className="mt-0.5 w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-colors shrink-0 group"
                >
                  <Check className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </button>
                
                <button
                  onClick={() => setSelectedTask(task)}
                  className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                >
                  <p className="text-sm font-medium">{task.text}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {task.scheduledDate ? (
                      <span className={cn(
                        "text-xs",
                        isOverdue(task.scheduledDate) ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {isOverdue(task.scheduledDate) && "Overdue · "}
                        {formatTaskDate(task.scheduledDate)}
                      </span>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          const today = format(new Date(), 'yyyy-MM-dd');
                          onUpdateTaskDate(task.id, today);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        + Add date
                      </span>
                    )}
                    {task.completedPomodoros > 0 && (
                      <span className="text-xs text-muted-foreground">
                        · {task.completedPomodoros} 🍅
                      </span>
                    )}
                    {task.notes && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        · <FileText className="w-3 h-3" /> Notes
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mood-transition"
                >
                  <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-background" />
                  </div>
                  <p className="text-sm text-muted-foreground line-through flex-1 truncate">
                    {task.text}
                  </p>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && onUpdateTaskNotes && onUpdateTaskChecklist && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateNotes={onUpdateTaskNotes}
          onUpdateChecklist={onUpdateTaskChecklist}
          onComplete={onCompleteTask}
        />
      )}
    </div>
  );
}
