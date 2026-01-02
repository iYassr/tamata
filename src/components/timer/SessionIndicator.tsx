import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useSettingsStore } from '@/stores/settingsStore'

interface SessionIndicatorProps {
  currentSession: number
  totalCompleted: number
}

export function SessionIndicator({ currentSession, totalCompleted }: SessionIndicatorProps) {
  const longBreakInterval = useSettingsStore(s => s.longBreakInterval)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Session dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length: longBreakInterval }).map((_, i) => {
          const isCompleted = i < currentSession - 1
          const isCurrent = i === currentSession - 1

          return (
            <motion.div
              key={i}
              className="relative"
              initial={false}
              animate={{ scale: isCurrent ? 1.3 : 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isCompleted
                    ? 'bg-primary'
                    : isCurrent
                    ? 'bg-primary/50 ring-2 ring-primary/50 ring-offset-2 ring-offset-background'
                    : 'bg-muted'
                  }
                `}
              />
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <Badge variant="secondary" className="gap-2">
        <span className="text-muted-foreground">Today:</span>
        <span className="font-semibold">{totalCompleted} sessions</span>
      </Badge>
    </div>
  )
}
