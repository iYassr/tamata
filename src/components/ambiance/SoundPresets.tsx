import { motion } from 'framer-motion'
import { presets } from '../../lib/sounds'

interface SoundPresetsProps {
  currentPreset: string | null
  onSelectPreset: (presetId: string) => void
}

export function SoundPresets({ currentPreset, onSelectPreset }: SoundPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const isActive = currentPreset === preset.id
        return (
          <motion.button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id)}
            className={`
              relative px-3 py-1.5 text-sm rounded-full border transition-all
              ${isActive
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {preset.name}
          </motion.button>
        )
      })}
    </div>
  )
}
