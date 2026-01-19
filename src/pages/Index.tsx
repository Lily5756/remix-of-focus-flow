import { useState } from 'react';
import { useFocusApp } from '@/hooks/useFocusApp';
import { TimerDisplay } from '@/components/focus/TimerDisplay';
import { DurationSelector } from '@/components/focus/DurationSelector';
import { TaskInput } from '@/components/focus/TaskInput';
import { TimerControls } from '@/components/focus/TimerControls';
import { ReflectionModal } from '@/components/focus/ReflectionModal';
import { StreakDisplay } from '@/components/focus/StreakDisplay';
import { Encouragement } from '@/components/focus/Encouragement';
import { ThemeToggle } from '@/components/focus/ThemeToggle';
import { TabNavigation } from '@/components/focus/TabNavigation';
import { CalendarView } from '@/components/focus/CalendarView';

type Tab = 'focus' | 'calendar';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  
  const {
    tasks,
    activeTask,
    selectedDuration,
    timer,
    showReflection,
    streakData,
    encouragement,
    addTask,
    selectTask,
    completeTask,
    updateDuration,
    startSession,
    submitReflection,
    skipReflection,
    endSession,
  } = useFocusApp();

  const isTimerActive = timer.state !== 'idle';

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Encouragement toast */}
      <Encouragement message={encouragement} />

      {/* Header with streak and theme toggle */}
      <header className="pt-6 pb-4 px-4 flex items-center justify-between">
        <div className="w-9" /> {/* Spacer for centering */}
        <StreakDisplay streakData={streakData} />
        <ThemeToggle />
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-center pb-4">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      {activeTab === 'focus' ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 -mt-4">
          {/* Timer */}
          <div className="mb-8">
            <TimerDisplay
              timeRemaining={timer.timeRemaining}
              progress={timer.progress}
              state={timer.state}
            />
          </div>

          {/* Duration selector */}
          <div className="mb-8">
            <DurationSelector
              selectedDuration={selectedDuration}
              onSelect={updateDuration}
              disabled={isTimerActive}
            />
          </div>

          {/* Task input */}
          <div className="mb-10 w-full">
            <TaskInput
              tasks={tasks}
              activeTask={activeTask}
              onAddTask={addTask}
              onSelectTask={selectTask}
              onCompleteTask={completeTask}
              disabled={isTimerActive}
            />
          </div>

          {/* Controls */}
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
      ) : (
        <main className="flex-1 flex flex-col px-2 pb-8">
          <CalendarView />
        </main>
      )}

      {/* Reflection modal */}
      {showReflection && (
        <ReflectionModal
          onSubmit={submitReflection}
          onSkip={skipReflection}
        />
      )}
    </div>
  );
}


