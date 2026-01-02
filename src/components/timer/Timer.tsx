import { useTimer } from '@/hooks/useTimer'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { SessionIndicator } from './SessionIndicator'
import { ModeSelector } from './ModeSelector'

export function Timer() {
  const {
    mode,
    timeRemaining,
    currentSession,
    totalSessions,
    progress,
    isRunning,
    toggle,
    reset,
    skip,
    setMode
  } = useTimer()

  return (
    <div className="flex flex-col items-center gap-8">
      <ModeSelector
        currentMode={mode}
        onModeChange={setMode}
        disabled={isRunning}
      />

      <TimerDisplay
        timeRemaining={timeRemaining}
        progress={progress}
        mode={mode}
        isRunning={isRunning}
      />

      <TimerControls
        isRunning={isRunning}
        onToggle={toggle}
        onReset={reset}
        onSkip={skip}
      />

      <SessionIndicator
        currentSession={currentSession}
        totalCompleted={totalSessions}
      />
    </div>
  )
}
