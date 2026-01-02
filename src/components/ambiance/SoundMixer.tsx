import { Volume2, VolumeX, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'
import { getSoundsByCategory } from '../../lib/sounds'
import { SoundPresets } from './SoundPresets'

const categories = [
  { id: 'rain', label: 'Rain & Weather' },
  { id: 'nature', label: 'Nature' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'noise', label: 'Noise' }
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

  const activeCount = Object.keys(activeSounds).length

  return (
    <div className="space-y-6">
      {/* Active sounds indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            {activeCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
              >
                {activeCount}
              </motion.div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {activeCount > 0 ? `${activeCount} sound${activeCount > 1 ? 's' : ''} playing` : 'No sounds active'}
            </div>
            <div className="text-xs text-zinc-500">Mix ambient sounds to focus</div>
          </div>
        </div>

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={stopAll}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <VolumeX className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Master Volume */}
      <div className="relative">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-zinc-400 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Master Volume
          </span>
          <span className="text-white font-medium">{Math.round(masterVolume * 100)}%</span>
        </div>
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            style={{ width: `${masterVolume * 100}%` }}
            layout
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Presets */}
      <SoundPresets
        currentPreset={currentPreset}
        onSelectPreset={selectPreset}
      />

      {/* Sound Grid */}
      {categories.map(({ id, label }) => {
        const categorySounds = getSoundsByCategory(id)
        return (
          <div key={id}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-600 mb-3">
              {label}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {categorySounds.map((sound) => {
                const isActive = sound.id in activeSounds
                const volume = activeSounds[sound.id] ?? 0.5

                return (
                  <motion.div
                    key={sound.id}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => toggle(sound.id)}
                      className={`
                        w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                        ${isActive
                          ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500/50 shadow-lg shadow-orange-500/10'
                          : 'bg-zinc-800/80 border-2 border-transparent hover:bg-zinc-700/80 hover:border-zinc-600'
                        }
                      `}
                    >
                      <span className="text-2xl">{sound.icon}</span>
                      <span className={`text-[10px] font-medium ${isActive ? 'text-orange-300' : 'text-zinc-500'}`}>
                        {sound.name}
                      </span>

                      {/* Volume indicator */}
                      {isActive && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                          <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-orange-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${volume * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Playing indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                        </motion.div>
                      )}
                    </button>

                    {/* Volume slider overlay */}
                    {isActive && (
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          e.stopPropagation()
                          setVolume(sound.id, parseFloat(e.target.value))
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-0 left-0 right-0 h-6 opacity-0 cursor-pointer"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
