import { cn } from '../../lib/utils'
import type { TimerMode } from '../../types'

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled?: boolean
}

const modes: { value: TimerMode; label: string }[] = [
  { value: 'work', label: 'Focus' },
  { value: 'shortBreak', label: 'Short Break' },
  { value: 'longBreak', label: 'Long Break' }
]

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-card rounded-lg border border-border">
      {modes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          disabled={disabled}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            currentMode === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card-hover',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
