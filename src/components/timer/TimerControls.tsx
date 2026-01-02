import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ isRunning, onToggle, onReset, onSkip }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <ControlButton
        onClick={onReset}
        label="Reset"
        shortcut="R"
      >
        <RotateCcw className="w-5 h-5" />
      </ControlButton>

      <motion.button
        onClick={onToggle}
        className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {/* Pulse ring */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-400"
            animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        <motion.div
          key={isRunning ? 'pause' : 'play'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </motion.div>
      </motion.button>

      <ControlButton
        onClick={onSkip}
        label="Skip"
        shortcut="S"
      >
        <SkipForward className="w-5 h-5" />
      </ControlButton>
    </div>
  )
}

function ControlButton({
  onClick,
  label,
  shortcut,
  children
}: {
  onClick: () => void
  label: string
  shortcut: string
  children: React.ReactNode
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-12 h-12 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {children}

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-zinc-800 text-xs text-zinc-300 px-2 py-1 rounded whitespace-nowrap">
          {label} <span className="text-zinc-500">({shortcut})</span>
        </div>
      </div>
    </motion.button>
  )
}
