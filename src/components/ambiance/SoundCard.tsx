import { motion } from 'framer-motion'
import type { Sound } from '../../types'

interface SoundCardProps {
  sound: Sound
  volume: number | undefined
  isActive: boolean
  onToggle: () => void
  onVolumeChange: (volume: number) => void
}

export function SoundCard({ sound, volume, isActive, onToggle, onVolumeChange }: SoundCardProps) {
  return (
    <motion.div
      layout
      className={`
        relative overflow-hidden rounded-xl border transition-all
        ${isActive
          ? 'bg-orange-500/10 border-orange-500/30'
          : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
        }
      `}
    >
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center gap-3 text-left"
      >
        <span className="text-xl">{sound.icon}</span>
        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>
          {sound.name}
        </span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto w-2 h-2 rounded-full bg-orange-500"
          />
        )}
      </button>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 pb-3"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume ?? 0.5}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
        </motion.div>
      )}
    </motion.div>
  )
}
