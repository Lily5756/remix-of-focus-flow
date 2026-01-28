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
  const [newTaskDate, setNewTaskDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() && newTaskDate) {
      onAddTask(newTaskText.trim(), newTaskDate);
      setNewTaskText('');
      setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
      setIsAdding(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return `Today, ${format(date, 'd MMM yyyy')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'd MMM yyyy')}`;
    return format(date, 'd MMM yyyy');
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
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto">
          {incompleteTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <Check className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow mood-transition"
                >
                  {/* Circular checkbox */}
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="mt-0.5 w-6 h-6 rounded-full border-2 border-muted-foreground/40 hover:border-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-all shrink-0 group"
                  >
                    <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => setSelectedTask(task)}
                    className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                  >
                    <p className="font-medium text-foreground">{task.text}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {task.scheduledDate ? (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          isOverdue(task.scheduledDate)
                            ? "text-destructive bg-destructive/10"
                            : "text-muted-foreground bg-muted"
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
                          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-0.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                        >
                          + Add date
                        </span>
                      )}
                      {task.completedPomodoros > 0 && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {task.completedPomodoros} pomodoro{task.completedPomodoros !== 1 ? 's' : ''}
                        </span>
                      )}
                      {task.notes && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Notes
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 mood-transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-foreground/80 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-background" />
                    </div>
                    <p className="text-sm text-muted-foreground line-through flex-1 truncate">
                      {task.text}
                    </p>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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

      {/* Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsAdding(false);
              setNewTaskText('');
              setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
            }}
          />
          <div className="relative w-full max-w-sm bg-card rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-bold">New Task</h2>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskText('');
                  setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
                }}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">What do you need to focus on?</label>
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task..."
                  autoFocus
                  maxLength={200}
                  className="w-full px-4 py-3.5 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mood-transition"
                />
                <p className="mt-1.5 text-xs text-muted-foreground text-right">
                  {newTaskText.length}/200
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Schedule for</label>
                <div
                  className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => document.getElementById('new-task-date')?.showPicker?.()}
                >
                  <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="text-sm flex-1 font-medium">{formatDateDisplay(newTaskDate)}</span>
                  <input
                    id="new-task-date"
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskText('');
                    setNewTaskDate(format(new Date(), 'yyyy-MM-dd'));
                  }}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-foreground text-background font-semibold disabled:opacity-50 transition-opacity shadow-md"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
