import { motion } from 'framer-motion'
import { formatTime } from '../../lib/utils'
import type { TimerMode } from '../../types'

interface TimerDisplayProps {
  timeRemaining: number
  progress: number
  mode: TimerMode
  isRunning: boolean
}

const modeConfig: Record<TimerMode, {
  gradient: string
  glow: string
  label: string
  bg: string
}> = {
  work: {
    gradient: 'url(#orangeGradient)',
    glow: 'rgba(249, 115, 22, 0.4)',
    label: 'Focus Time',
    bg: 'rgba(249, 115, 22, 0.05)'
  },
  shortBreak: {
    gradient: 'url(#greenGradient)',
    glow: 'rgba(34, 197, 94, 0.4)',
    label: 'Short Break',
    bg: 'rgba(34, 197, 94, 0.05)'
  },
  longBreak: {
    gradient: 'url(#blueGradient)',
    glow: 'rgba(59, 130, 246, 0.4)',
    label: 'Long Break',
    bg: 'rgba(59, 130, 246, 0.05)'
  }
}

export function TimerDisplay({ timeRemaining, progress, mode, isRunning }: TimerDisplayProps) {
  const config = modeConfig[mode]
  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-1000"
        style={{
          background: config.glow,
          transform: isRunning ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      {/* Background circle */}
      <div
        className="absolute inset-4 rounded-full transition-colors duration-500"
        style={{ background: config.bg }}
      />

      <svg
        className="transform -rotate-90 relative z-10"
        width="320"
        height="320"
        viewBox="0 0 320 320"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="rgba(63, 63, 70, 0.5)"
          strokeWidth="8"
        />

        {/* Progress */}
        <motion.circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke={config.gradient}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          filter={isRunning ? 'url(#glow)' : undefined}
        />

        {/* End cap glow */}
        {progress > 0 && (
          <motion.circle
            cx={160 + 140 * Math.cos((progress * 2 * Math.PI) - Math.PI / 2)}
            cy={160 + 140 * Math.sin((progress * 2 * Math.PI) - Math.PI / 2)}
            r="5"
            fill="white"
            opacity={isRunning ? 0.8 : 0.5}
          />
        )}
      </svg>

      {/* Timer content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3"
          animate={{ opacity: isRunning ? [0.5, 1, 0.5] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {config.label}
        </motion.span>

        <motion.div
          className="text-7xl font-bold tabular-nums tracking-tight text-white"
          animate={isRunning ? {
            textShadow: [
              '0 0 20px rgba(255,255,255,0)',
              '0 0 20px rgba(255,255,255,0.3)',
              '0 0 20px rgba(255,255,255,0)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {formatTime(timeRemaining)}
        </motion.div>

        <div className="mt-4 text-xs text-zinc-600">
          {isRunning ? 'Running' : 'Paused'}
        </div>
      </div>
    </div>
  )
}
