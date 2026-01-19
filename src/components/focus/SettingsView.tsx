import { useState } from 'react';
import { User, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  userName: string;
  onUpdateName: (name: string) => void;
}

export function SettingsView({ userName, onUpdateName }: SettingsViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveName = () => {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError("Tell me your name first 😄");
      return;
    }
    
    if (trimmedName.length > 15) {
      setError("That's a bit long! Max 15 characters 😅");
      return;
    }

    onUpdateName(trimmedName);
    setIsEditingName(false);
    setError('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancel = () => {
    setNewName(userName);
    setIsEditingName(false);
    setError('');
  };

  return (
    <div className="flex flex-col h-full px-4">
      {/* Header */}
      <div className="py-4">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-foreground text-background flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Name updated!</span>
        </div>
      )}

      {/* Settings list */}
      <div className="space-y-2">
        {/* Edit Name */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-4 py-1 bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Profile</p>
          </div>
          
          {isEditingName ? (
            <div className="p-4 space-y-3">
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    if (e.target.value.length <= 15) {
                      setNewName(e.target.value);
                      if (error) setError('');
                    }
                  }}
                  placeholder="Your name"
                  autoFocus
                  maxLength={15}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-muted border-2 transition-colors",
                    "placeholder:text-muted-foreground focus:outline-none",
                    error 
                      ? "border-destructive" 
                      : "border-transparent focus:border-foreground"
                  )}
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground text-right">
                  {newName.length}/15
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSaveName}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-foreground text-background font-medium text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="py-2.5 px-4 rounded-xl bg-muted text-muted-foreground font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Your Name</p>
                <p className="text-sm text-muted-foreground">{userName}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* About section */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-4 py-1 bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">About</p>
          </div>
          
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground">
              A cozy Pomodoro timer to help you focus. Your data is stored locally and works offline. ✨
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Made with 💛 for focused minds
        </p>
      </div>
    </div>
  );
}
