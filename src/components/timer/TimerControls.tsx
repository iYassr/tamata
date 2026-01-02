import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '../ui/Button'

interface TimerControlsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ isRunning, onToggle, onReset, onSkip }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        title="Reset (R)"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      <Button
        variant="primary"
        size="lg"
        onClick={onToggle}
        className="w-16 h-16 rounded-full"
        title="Start/Pause (Space)"
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="w-7 h-7" />
        ) : (
          <Play className="w-7 h-7 ml-1" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onSkip}
        title="Skip (S)"
        aria-label="Skip to next session"
      >
        <SkipForward className="w-5 h-5" />
      </Button>
    </div>
  )
}
