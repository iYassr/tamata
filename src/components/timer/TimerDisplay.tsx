import { motion } from 'framer-motion'
import { formatTime, cn } from '../../lib/utils'
import type { TimerMode } from '../../types'

interface TimerDisplayProps {
  timeRemaining: number
  progress: number
  mode: TimerMode
  isRunning: boolean
}

const modeColors: Record<TimerMode, { stroke: string; glow: string }> = {
  work: { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.3)' },
  shortBreak: { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)' },
  longBreak: { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' }
}

const modeLabels: Record<TimerMode, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
}

export function TimerDisplay({ timeRemaining, progress, mode, isRunning }: TimerDisplayProps) {
  const colors = modeColors[mode]
  const circumference = 2 * Math.PI * 140 // radius = 140
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width="320"
        height="320"
        viewBox="0 0 320 320"
      >
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            filter: isRunning ? `drop-shadow(0 0 10px ${colors.glow})` : 'none'
          }}
        />
      </svg>

      {/* Timer content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
          {modeLabels[mode]}
        </span>
        <motion.span
          className={cn(
            'text-6xl font-bold tabular-nums',
            isRunning && 'text-foreground'
          )}
          animate={isRunning ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {formatTime(timeRemaining)}
        </motion.span>
      </div>
    </div>
  )
}
