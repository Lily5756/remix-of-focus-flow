import { useState } from 'react';
import { User, ChevronRight, Check, Palette, Cloud, RefreshCw, LogOut, LogIn, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMoodTheme, MoodTheme } from '@/hooks/useMoodTheme';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { CloudData } from '@/hooks/useCloudSync';

interface SettingsViewProps {
  userName: string;
  onUpdateName: (name: string) => void;
  syncStatus?: {
    isSyncing: boolean;
    lastSyncedAt: Date | null;
    isOnline: boolean;
    error: string | null;
  };
  onSyncNow?: () => Promise<void>;
  onRestoreFromCloud?: () => Promise<void>;
}

const MOOD_ICONS: Record<MoodTheme, string> = {
  auto: '🕐',
  cozy: '☕',
  'locked-in': '🔒',
  fresh: '🌤️',
};

export function SettingsView({ 
  userName, 
  onUpdateName,
  syncStatus,
  onSyncNow,
  onRestoreFromCloud,
}: SettingsViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { selectedMood, setMood, moodLabels, moodDescriptions, allMoods, activeMood } = useMoodTheme();
  const { user, isAuthenticated, signOut, isLoading } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
  };

  const formatLastSynced = () => {
    if (!syncStatus?.lastSyncedAt) return 'Never synced';
    const now = new Date();
    const diff = now.getTime() - syncStatus.lastSyncedAt.getTime();
    
    if (diff < 60000) return 'Synced just now';
    if (diff < 3600000) return `Synced ${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `Synced ${Math.floor(diff / 3600000)}h ago`;
    return `Synced ${syncStatus.lastSyncedAt.toLocaleDateString()}`;
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
      <div className="space-y-2 overflow-y-auto flex-1">
        {/* Account & Sync Section */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden mood-transition">
          <div className="px-4 py-1 bg-muted/50 flex items-center gap-2">
            <Cloud className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account & Sync</p>
          </div>
          
          <div className="p-3 space-y-2">
            {/* Login status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isAuthenticated ? "bg-primary/20" : "bg-muted"
                )}>
                  {isAuthenticated ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isAuthenticated ? 'Logged in' : 'Guest Mode'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAuthenticated ? user?.email : 'Data stored locally only'}
                  </p>
                </div>
              </div>
              
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              )}
            </div>

            {/* Sync status - only show when authenticated */}
            {isAuthenticated && syncStatus && (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    {syncStatus.isOnline ? (
                      <Wifi className="w-4 h-4 text-primary" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Cloud Sync</p>
                      <p className="text-xs text-muted-foreground">
                        {syncStatus.isSyncing ? 'Syncing...' : 
                         !syncStatus.isOnline ? 'Offline — will sync later' :
                         formatLastSynced()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    syncStatus.isOnline ? "bg-green-500" : "bg-yellow-500"
                  )} />
                </div>

                {/* Sync buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={onSyncNow}
                    disabled={syncStatus.isSyncing || !syncStatus.isOnline}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2",
                      "bg-primary text-primary-foreground hover:opacity-90",
                      (syncStatus.isSyncing || !syncStatus.isOnline) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RefreshCw className={cn("w-4 h-4", syncStatus.isSyncing && "animate-spin")} />
                    Sync Now
                  </button>
                  
                  <button
                    onClick={onRestoreFromCloud}
                    disabled={syncStatus.isSyncing}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2",
                      "bg-muted text-foreground hover:bg-muted/80",
                      syncStatus.isSyncing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Cloud className="w-4 h-4" />
                    Restore
                  </button>
                </div>
              </>
            )}

            {/* Benefits for guests */}
            {!isAuthenticated && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  🔒 <strong className="text-foreground">Sign in</strong> to sync your progress across devices and never lose your Focus Points, room items, or streaks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Name */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden mood-transition">
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
                    "w-full px-4 py-3 rounded-xl bg-muted border-2 transition-colors mood-transition",
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-foreground text-background font-medium text-sm mood-transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="py-2.5 px-4 rounded-xl bg-muted text-muted-foreground font-medium text-sm mood-transition"
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
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mood-transition">
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

        {/* Theme Picker */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden mood-transition">
          <div className="px-4 py-1 bg-muted/50 flex items-center gap-2">
            <Palette className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Theme</p>
          </div>
          
          <div className="p-2 space-y-1">
            {allMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => setMood(mood)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200",
                  selectedMood === mood
                    ? "bg-foreground text-background"
                    : "hover:bg-muted/70"
                )}
              >
                <span className="text-lg">{MOOD_ICONS[mood]}</span>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "text-sm font-medium",
                    selectedMood === mood ? "text-background" : "text-foreground"
                  )}>
                    {moodLabels[mood]}
                  </p>
                  <p className={cn(
                    "text-xs",
                    selectedMood === mood ? "text-background/70" : "text-muted-foreground"
                  )}>
                    {moodDescriptions[mood]}
                    {mood === 'auto' && ` (now: ${moodLabels[activeMood].split(' ')[0]})`}
                  </p>
                </div>
                {selectedMood === mood && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* About section */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden mood-transition">
          <div className="px-4 py-1 bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">About</p>
          </div>
          
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground">
              A cozy Pomodoro timer to help you focus. {isAuthenticated ? 'Your data syncs to the cloud.' : 'Your data is stored locally.'} ✨
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Made with 💛 for focused minds
        </p>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            // Will trigger restore from cloud in parent
          }}
        />
      )}
    </div>
  );
}
