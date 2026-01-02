import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'

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
              animate={{
                scale: isCurrent ? 1.2 : 1
              }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isCompleted
                    ? 'bg-orange-500'
                    : isCurrent
                    ? 'bg-orange-500/50 ring-2 ring-orange-500/50 ring-offset-2 ring-offset-zinc-900'
                    : 'bg-zinc-700'
                  }
                `}
              />
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-500"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-zinc-500">Today:</span>
        <span className="text-white font-medium">{totalCompleted}</span>
        <span className="text-zinc-600">session{totalCompleted !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
