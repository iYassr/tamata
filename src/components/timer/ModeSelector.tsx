import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TimerMode } from '@/types'

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled?: boolean
}

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  const { t } = useLanguage()

  const modes: { value: TimerMode; labelKey: 'focus' | 'shortBreak' | 'longBreak' }[] = [
    { value: 'work', labelKey: 'focus' },
    { value: 'shortBreak', labelKey: 'shortBreak' },
    { value: 'longBreak', labelKey: 'longBreak' }
  ]

  return (
    <ToggleGroup
      type="single"
      value={currentMode}
      onValueChange={(value) => value && onModeChange(value as TimerMode)}
      disabled={disabled}
      className="bg-secondary/50 p-1 rounded-xl"
    >
      {modes.map(({ value, labelKey }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="px-4 py-2 text-sm font-medium rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {t(labelKey)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
