import { useState, useEffect, useCallback } from 'react';
import { X, FileText, Check, Plus, Square, CheckSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, ChecklistItem } from '@/types/focus';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onUpdateChecklist: (taskId: string, checklist: ChecklistItem[]) => void;
  onComplete: (taskId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export function TaskDetailModal({ 
  task, 
  onClose, 
  onUpdateNotes,
  onUpdateChecklist,
  onComplete 
}: TaskDetailModalProps) {
  const [notes, setNotes] = useState(task.notes || '');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist || []);
  const [newItemText, setNewItemText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Debounced auto-save for notes
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

  // Debounced auto-save for checklist
  useEffect(() => {
    const timer = setTimeout(() => {
      const taskChecklist = task.checklist || [];
      if (JSON.stringify(checklist) !== JSON.stringify(taskChecklist)) {
        setIsSaving(true);
        onUpdateChecklist(task.id, checklist);
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [checklist, task.id, task.checklist, onUpdateChecklist]);

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

  const addChecklistItem = useCallback(() => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: generateId(),
      text: newItemText.trim(),
      completed: false,
    };
    setChecklist(prev => [...prev, newItem]);
    setNewItemText('');
  }, [newItemText]);

  const toggleChecklistItem = useCallback((itemId: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const deleteChecklistItem = useCallback((itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChecklistItem();
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;

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

          {/* Checklist */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              Checklist
              {checklist.length > 0 && (
                <span className="text-xs font-normal">
                  ({completedCount}/{checklist.length})
                </span>
              )}
            </label>
            
            {/* Checklist items */}
            <div className="mt-2 space-y-1">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg group",
                    "bg-muted/50 hover:bg-muted transition-colors"
                  )}
                >
                  <button
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex-shrink-0 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <span className={cn(
                    "flex-1 text-sm",
                    item.completed && "line-through text-muted-foreground"
                  )}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteChecklistItem(item.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new item */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50 focus-within:border-foreground/30 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add item..."
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              {newItemText.trim() && (
                <button
                  onClick={addChecklistItem}
                  className="p-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
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
                "resize-none min-h-[120px] transition-colors mood-transition"
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
