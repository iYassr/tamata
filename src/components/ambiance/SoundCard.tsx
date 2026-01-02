import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Slider } from '../ui/Slider'
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
      className={cn(
        'p-3 rounded-lg border transition-all cursor-pointer',
        isActive
          ? 'bg-primary/10 border-primary'
          : 'bg-card border-border hover:border-muted'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 mb-2"
      >
        <span className="text-2xl">{sound.icon}</span>
        <span className={cn(
          'text-sm font-medium',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {sound.name}
        </span>
      </button>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-2"
        >
          <Slider
            value={volume ?? 0.5}
            onValueChange={onVolumeChange}
            min={0}
            max={1}
            step={0.05}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
