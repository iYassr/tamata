import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'
import { getSoundsByCategory } from '../../lib/sounds'
import { SoundCard } from './SoundCard'
import { SoundPresets } from './SoundPresets'

const categories = [
  { id: 'rain', label: 'Rain & Weather', icon: '🌧️' },
  { id: 'nature', label: 'Nature', icon: '🌲' },
  { id: 'ambient', label: 'Ambient', icon: '☕' },
  { id: 'noise', label: 'Noise', icon: '📻' }
] as const

export function SoundMixer() {
  const {
    activeSounds,
    masterVolume,
    currentPreset,
    setVolume,
    toggle,
    selectPreset,
    stopAll,
    setMasterVolume
  } = useAudio()

  const hasActiveSounds = Object.keys(activeSounds).length > 0

  return (
    <div className="space-y-6">
      {/* Master Volume */}
      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-white">Master Volume</span>
          </div>
          <span className="text-sm text-zinc-500">{Math.round(masterVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Stop All */}
      {hasActiveSounds && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={stopAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-colors"
        >
          <VolumeX className="w-4 h-4" />
          Stop All Sounds
        </motion.button>
      )}

      {/* Presets */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Quick Presets</h3>
        <SoundPresets
          currentPreset={currentPreset}
          onSelectPreset={selectPreset}
        />
      </div>

      {/* Sound Categories */}
      {categories.map(({ id, label, icon }) => {
        const categorySounds = getSoundsByCategory(id)
        return (
          <div key={id}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
              <span>{icon}</span>
              {label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categorySounds.map((sound) => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  volume={activeSounds[sound.id]}
                  isActive={sound.id in activeSounds}
                  onToggle={() => toggle(sound.id)}
                  onVolumeChange={(v) => setVolume(sound.id, v)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
