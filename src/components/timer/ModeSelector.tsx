import { motion } from 'framer-motion'
import type { TimerMode } from '../../types'

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled?: boolean
}

const modes: { value: TimerMode; label: string; color: string }[] = [
  { value: 'work', label: 'Focus', color: 'orange' },
  { value: 'shortBreak', label: 'Short Break', color: 'green' },
  { value: 'longBreak', label: 'Long Break', color: 'blue' }
]

const colorClasses = {
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500'
}

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-900/80 backdrop-blur rounded-2xl border border-zinc-800">
      {modes.map(({ value, label, color }) => {
        const isActive = currentMode === value
        return (
          <button
            key={value}
            onClick={() => onModeChange(value)}
            disabled={disabled}
            className={`
              relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeMode"
                className={`absolute inset-0 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl`}
                style={{ opacity: 0.15 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-1.5 h-1.5 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
                />
              )}
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
