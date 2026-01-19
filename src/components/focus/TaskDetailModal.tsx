import { useState, useEffect, useCallback } from 'react';
import { X, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/focus';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskDetailModal({ 
  task, 
  onClose, 
  onUpdateNotes, 
  onComplete 
}: TaskDetailModalProps) {
  const [notes, setNotes] = useState(task.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes !== task.notes) {
        setIsSaving(true);
        onUpdateNotes(task.id, notes);
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [notes, task.id, task.notes, onUpdateNotes]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleComplete = useCallback(() => {
    onComplete(task.id);
    onClose();
  }, [task.id, onComplete, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 mood-transition">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold">Task Details</h2>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Saving...
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Task title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Task
            </label>
            <p className="mt-1 text-lg font-medium">{task.text}</p>
            {task.completedPomodoros > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                🍅 {task.completedPomodoros} pomodoro{task.completedPomodoros > 1 ? 's' : ''} completed
              </p>
            )}
          </div>

          {/* Notes editor */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes, ideas, or progress updates..."
              className={cn(
                "w-full mt-2 p-4 rounded-xl bg-muted border-2 border-transparent",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:border-foreground",
                "resize-none min-h-[200px] transition-colors mood-transition"
              )}
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {notes.length} characters
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button
            onClick={handleComplete}
            className="flex-1 py-3 px-4 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mood-transition"
          >
            <Check className="w-4 h-4" />
            Mark Complete
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-accent transition-colors mood-transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
