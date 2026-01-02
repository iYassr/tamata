import { cn } from '../../lib/utils'
import { useSettingsStore } from '../../stores/settingsStore'

interface SessionIndicatorProps {
  currentSession: number
  totalCompleted: number
}

export function SessionIndicator({ currentSession, totalCompleted }: SessionIndicatorProps) {
  const longBreakInterval = useSettingsStore(s => s.longBreakInterval)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: longBreakInterval }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              i < currentSession - 1
                ? 'bg-primary'
                : i === currentSession - 1
                ? 'bg-primary/50 ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'bg-border'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {totalCompleted} session{totalCompleted !== 1 ? 's' : ''} today
      </span>
    </div>
  )
}
