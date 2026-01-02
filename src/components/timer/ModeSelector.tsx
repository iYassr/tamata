import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { TimerMode } from '@/types'

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
    <ToggleGroup
      type="single"
      value={currentMode}
      onValueChange={(value) => value && onModeChange(value as TimerMode)}
      disabled={disabled}
      className="bg-secondary/50 p-1 rounded-xl"
    >
      {modes.map(({ value, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="px-4 py-2 text-sm font-medium rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
