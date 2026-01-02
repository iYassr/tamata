import { motion } from 'framer-motion'
import { formatTime } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TimerMode } from '@/types'

interface TimerDisplayProps {
  timeRemaining: number
  progress: number
  mode: TimerMode
  isRunning: boolean
}

export function TimerDisplay({ timeRemaining, progress, mode, isRunning }: TimerDisplayProps) {
  const { t } = useLanguage()

  const modeConfig: Record<TimerMode, {
    gradient: string
    glowColor: string
    labelKey: 'focusTime' | 'shortBreak' | 'longBreak'
  }> = {
    work: {
      gradient: 'from-orange-500 to-amber-500',
      glowColor: 'orange',
      labelKey: 'focusTime'
    },
    shortBreak: {
      gradient: 'from-emerald-500 to-green-500',
      glowColor: 'emerald',
      labelKey: 'shortBreak'
    },
    longBreak: {
      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'blue',
      labelKey: 'longBreak'
    }
  }

  const config = modeConfig[mode]
  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect */}
      <motion.div
        className={`absolute w-80 h-80 rounded-full bg-gradient-to-br ${config.gradient} opacity-20 blur-3xl`}
        animate={{
          scale: isRunning ? [1, 1.1, 1] : 1,
          opacity: isRunning ? [0.15, 0.25, 0.15] : 0.1
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        className="transform -rotate-90 relative z-10"
        width="320"
        height="320"
        viewBox="0 0 320 320"
      >
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:var(--primary)]" />
            <stop offset="100%" className="[stop-color:var(--accent)]" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          className="stroke-muted"
          strokeWidth="8"
        />

        {/* Progress */}
        <motion.circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          className="stroke-primary"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Timer content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3"
          animate={{ opacity: isRunning ? [0.5, 1, 0.5] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t(config.labelKey)}
        </motion.span>

        <motion.div
          className="text-7xl font-bold tabular-nums tracking-tight"
          animate={isRunning ? {
            opacity: [1, 0.8, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {formatTime(timeRemaining)}
        </motion.div>

        <div className="mt-4 text-xs text-muted-foreground">
          {isRunning ? t('running') : t('ready')}
        </div>
      </div>
    </div>
  )
}
