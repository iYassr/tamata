import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { presets } from '../../lib/sounds'

interface SoundPresetsProps {
  currentPreset: string | null
  onSelectPreset: (presetId: string) => void
}

const presetIcons: Record<string, string> = {
  'rainy-cafe': '🌧️☕',
  'forest-retreat': '🌲🐦',
  'cozy-fire': '🔥🌧️',
  'ocean-breeze': '🌊',
  'deep-focus': '🧠',
  'lofi-rain': '🎵🌧️'
}

export function SoundPresets({ currentPreset, onSelectPreset }: SoundPresetsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-600">
          Quick Presets
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const isActive = currentPreset === preset.id
          return (
            <motion.button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`
                relative p-3 rounded-xl text-left transition-all overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/30'
                  : 'bg-zinc-800/60 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{presetIcons[preset.id] || '🎵'}</span>
                <span className={`text-sm font-medium ${isActive ? 'text-violet-300' : 'text-zinc-400'}`}>
                  {preset.name}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activePreset"
                  className="absolute inset-0 border-2 border-violet-500/50 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
