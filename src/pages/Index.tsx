import { useState, useEffect, useCallback } from 'react';
import { User, Home, Settings } from 'lucide-react';
import { useFocusApp } from '@/hooks/useFocusApp';
import { useFocusMusic } from '@/hooks/useFocusMusic';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { TimerDisplay } from '@/components/focus/TimerDisplay';
import { DurationSelector } from '@/components/focus/DurationSelector';
import { TaskInput } from '@/components/focus/TaskInput';
import { TimerControls } from '@/components/focus/TimerControls';
import { MusicControls } from '@/components/focus/MusicControls';
import { ReflectionModal } from '@/components/focus/ReflectionModal';
import { StreakDisplay } from '@/components/focus/StreakDisplay';
import { Encouragement } from '@/components/focus/Encouragement';
import { ThemeToggle } from '@/components/focus/ThemeToggle';
import { TabNavigation, Tab } from '@/components/focus/TabNavigation';
import { CalendarView } from '@/components/focus/CalendarView';
import { TasksView } from '@/components/focus/TasksView';
import { WelcomeScreen } from '@/components/focus/WelcomeScreen';
import { GreetingBanner } from '@/components/focus/GreetingBanner';
import { SettingsView } from '@/components/focus/SettingsView';
import { ReportView } from '@/components/focus/ReportView';
import { AmbientEffects } from '@/components/focus/AmbientEffects';
import { TaskDetailModal } from '@/components/focus/TaskDetailModal';
import { AvatarSelector, getAvatarSrc } from '@/components/focus/AvatarSelector';
import { MilestoneCelebration } from '@/components/focus/MilestoneCelebration';
import { RoomView } from '@/components/focus/RoomView';
import { PointsToast } from '@/components/focus/PointsToast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const [showGreeting, setShowGreeting] = useState(false);
  const [hasShownGreeting, setHasShownGreeting] = useState(() => {
    return localStorage.getItem('calmodoro_greeting_shown') === 'true';
  });
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  // Initialize mood theme (applies to document)
  const { activeMood } = useMoodTheme();
  
  const {
    tasks,
    allTasks,
    activeTask,
    selectedDuration,
    timer,
    showReflection,
    streakData,
    encouragement,
    milestoneMessage,
    userName,
    avatarId,
    customAvatar,
    addTask,
    selectTask,
    completeTask,
    deleteTask,
    updateTaskDate,
    updateTaskNotes,
    updateTaskChecklist,
    updateDuration,
    startSession,
    submitReflection,
    skipReflection,
    endSession,
    setUserName,
    setAvatarId,
    setCustomAvatar,
    lastPointsEarned,
    roomBuilder,
    syncStatus,
    syncNow,
    restoreFromCloud,
  } = useFocusApp();

  const avatarSrc = getAvatarSrc(avatarId, customAvatar);

  const music = useFocusMusic();

  const isTimerActive = timer.state !== 'idle';
  const isFocusing = timer.state === 'focus';
  const isPaused = timer.state === 'paused';

  // Sync music with timer state
  useEffect(() => {
    if (isFocusing) {
      music.startMusic();
    } else if (isPaused) {
      music.pauseMusic();
    } else {
      music.stopMusic();
    }
  }, [isFocusing, isPaused]);

  // Show greeting banner only for first-time users (not returning users)
  useEffect(() => {
    if (userName && !hasShownGreeting) {
      // Only show greeting for brand new users (handled in handleWelcomeComplete)
      // Returning users with saved userName won't see the greeting
      localStorage.setItem('calmodoro_greeting_shown', 'true');
      setHasShownGreeting(true);
    }
  }, [userName, hasShownGreeting]);

  const handleWelcomeComplete = useCallback((name: string) => {
    setUserName(name);
    setShowGreeting(true);
    setHasShownGreeting(true);
  }, [setUserName]);

  const handleGreetingDismiss = useCallback(() => {
    setShowGreeting(false);
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  // Show welcome screen if no user name
  if (!userName) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col mood-transition relative">
      {/* Ambient effects based on mood */}
      <AmbientEffects mood={activeMood} isActive={isFocusing} />
      {/* Greeting banner */}
      {showGreeting && (
        <GreetingBanner name={userName} onDismiss={handleGreetingDismiss} />
      )}

      {/* Encouragement toast */}
      <Encouragement message={encouragement} />

      {/* Milestone celebration */}
      <MilestoneCelebration message={milestoneMessage} />

      {/* Points earned toast */}
      <PointsToast points={lastPointsEarned} />

      {/* Header with profile, streak and theme toggle */}
      <header className="pt-6 pb-4 px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            console.log('Avatar button clicked');
            setShowAvatarSelector(true);
          }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-card shadow-sm flex items-center justify-center overflow-hidden border border-border">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          {userName && (
            <span className="text-sm font-semibold text-foreground">{userName}</span>
          )}
        </button>
        <StreakDisplay streakData={streakData} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('room')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              activeTab === 'room'
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              activeTab === 'settings'
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Bottom Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        timerDisplay={`${Math.floor(timer.timeRemaining / 60).toString().padStart(2, '0')}:${(timer.timeRemaining % 60).toString().padStart(2, '0')}`}
        isTimerActive={isTimerActive}
      />

      {/* Content */}
      {activeTab === 'focus' && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 pt-4">
          <div className="mb-6">
            <TimerDisplay
              timeRemaining={timer.timeRemaining}
              progress={timer.progress}
              state={timer.state}
            />
          </div>

          <div className="mb-8">
            <DurationSelector
              selectedDuration={selectedDuration}
              onSelect={updateDuration}
              disabled={isTimerActive}
            />
          </div>

          <div className="mb-6 w-full">
            <TaskInput
              tasks={tasks}
              activeTask={activeTask}
              onAddTask={(text) => addTask(text, null)}
              onSelectTask={selectTask}
              onCompleteTask={completeTask}
              disabled={isTimerActive}
            />
          </div>

          {/* Quick notes button for active task */}
          {activeTask && (
            <button
              onClick={() => setShowTaskDetail(true)}
              className="mb-6 px-5 py-2.5 rounded-xl bg-card border border-border text-muted-foreground text-sm flex items-center gap-2 hover:bg-muted hover:text-foreground transition-all shadow-sm"
            >
              <span className="text-base">📝</span>
              <span className="font-medium">
                {activeTask.notes ? 'View Notes' : 'Add Notes'}
              </span>
            </button>
          )}

          {/* Music Controls - show during focus or break */}
          {isTimerActive && (
            <div className="mb-6 w-full max-w-sm">
              <MusicControls
                isPlaying={music.isPlaying}
                isMusicEnabled={music.isMusicEnabled}
                volume={music.volume}
                onToggleMusic={music.toggleMusic}
                onSkipTrack={music.skipTrack}
                onVolumeChange={music.updateVolume}
              />
            </div>
          )}

          <TimerControls
            state={timer.state}
            hasActiveTask={!!activeTask}
            onStart={startSession}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={endSession}
            onSkipBreak={timer.skipBreak}
          />
        </main>
      )}

      {activeTab === 'tasks' && (
        <main className="flex-1 flex flex-col pb-24">
          <TasksView
            tasks={allTasks}
            onAddTask={addTask}
            onCompleteTask={completeTask}
            onDeleteTask={deleteTask}
            onUpdateTaskDate={updateTaskDate}
            onUpdateTaskNotes={updateTaskNotes}
            onUpdateTaskChecklist={updateTaskChecklist}
          />
        </main>
      )}

      {activeTab === 'calendar' && (
        <main className="flex-1 flex flex-col px-2 pb-24">
          <CalendarView />
        </main>
      )}

      {activeTab === 'room' && (
        <main className="flex-1 flex flex-col pb-24">
          <RoomView
            roomName={roomBuilder.roomName}
            onRoomNameChange={roomBuilder.setRoomName}
            focusPoints={roomBuilder.focusPoints}
            totalCompletedPomodoros={roomBuilder.totalCompletedPomodoros}
            longestStreak={streakData.longestStreak}
            ownedItems={roomBuilder.ownedItems}
            placedItems={roomBuilder.placedItems}
            unplacedOwnedItems={roomBuilder.unplacedOwnedItems}
            isTimerActive={isTimerActive}
            appUrl="https://calmodoro.lovable.app"
            onPurchase={roomBuilder.purchaseItem}
            onPlaceItem={roomBuilder.placeItem}
            onRemoveItem={roomBuilder.removeItemFromGrid}
            isItemUnlocked={roomBuilder.isItemUnlocked}
            ownsItem={roomBuilder.ownsItem}
            onClaimReward={roomBuilder.claimSharingReward}
            hasClaimedReward={roomBuilder.hasClaimedReward}
          />
        </main>
      )}

      {activeTab === 'report' && (
        <main className="flex-1 flex flex-col pb-24">
          <ReportView userName={userName} />
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="flex-1 flex flex-col pb-24">
          <SettingsView 
            userName={userName} 
            onUpdateName={setUserName}
            syncStatus={syncStatus}
            onSyncNow={syncNow}
            onRestoreFromCloud={restoreFromCloud}
          />
        </main>
      )}

      {showReflection && (
        <ReflectionModal
          onSubmit={submitReflection}
          onSkip={skipReflection}
        />
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && activeTask && (
        <TaskDetailModal
          task={activeTask}
          onClose={() => setShowTaskDetail(false)}
          onUpdateNotes={updateTaskNotes}
          onUpdateChecklist={updateTaskChecklist}
          onComplete={completeTask}
        />
      )}

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatarId={avatarId}
          customAvatar={customAvatar}
          onSelectAvatar={setAvatarId}
          onUploadAvatar={setCustomAvatar}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}
