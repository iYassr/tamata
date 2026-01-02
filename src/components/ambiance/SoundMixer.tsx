import { useState } from 'react'
import { Volume2, VolumeX, Waves, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '@/hooks/useAudio'
import { getSoundsByCategory } from '@/lib/sounds'
import { SoundPresets } from './SoundPresets'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/lib/i18n'

const categories = [
  { id: 'rain', labelKey: 'rainWeather' },
  { id: 'nature', labelKey: 'nature' },
  { id: 'ambient', labelKey: 'ambient' },
  { id: 'noise', labelKey: 'noise' }
] as const

const soundNameKeys: Record<string, TranslationKey> = {
  'rain-light': 'lightRain',
  'rain-heavy': 'heavyRain',
  'thunder': 'thunder',
  'forest': 'forest',
  'ocean': 'oceanWaves',
  'birds': 'birds',
  'fire': 'fireplace',
  'wind': 'wind',
  'cafe': 'coffeeShop',
  'library': 'library',
  'train': 'train',
  'typing': 'typing',
  'white-noise': 'whiteNoise',
  'pink-noise': 'pinkNoise',
  'brown-noise': 'brownNoise'
}

export function SoundMixer() {
  const {
    activeSounds,
    masterVolume,
    currentPreset,
    userPresets,
    setVolume,
    toggle,
    selectPreset,
    stopAll,
    setMasterVolume,
    savePreset,
    deletePreset,
    selectUserPreset
  } = useAudio()

  const { t } = useLanguage()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState('')
  const activeCount = Object.keys(activeSounds).length

  const handleSavePreset = () => {
    if (presetName.trim() && activeCount > 0) {
      savePreset(presetName.trim())
      setPresetName('')
      setShowSaveDialog(false)
    }
  }

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
              >
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeCount}
                </Badge>
              </motion.div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">
              {activeCount > 0
                ? `${activeCount} ${activeCount > 1 ? t('soundsPlaying') : t('soundPlaying')}`
                : t('noSoundsActive')
              }
            </div>
            <div className="text-xs text-muted-foreground">{t('mixAmbientSounds')}</div>
          </div>
        </div>

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={stopAll}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <VolumeX className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Master Volume */}
      <div className="p-4 rounded-xl border bg-secondary/30">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-muted-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            {t('masterVolume')}
          </span>
          <Badge variant="secondary">{Math.round(masterVolume * 100)}%</Badge>
        </div>
        <Slider
          value={[masterVolume * 100]}
          onValueChange={([value]) => setMasterVolume(value / 100)}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Presets */}
      <SoundPresets
        currentPreset={currentPreset}
        onSelectPreset={selectPreset}
      />

      {/* User Presets */}
      {userPresets.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            {t('myPresets')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {userPresets.map((preset) => {
              const isActive = currentPreset === preset.id
              return (
                <motion.div
                  key={preset.id}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`
                      cursor-pointer transition-all overflow-hidden rounded-xl border p-3
                      ${isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-secondary/50 bg-card'
                      }
                    `}
                    onClick={() => selectUserPreset(preset)}
                  >
                    <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {preset.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePreset(preset.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Save Preset Button/Dialog */}
      {activeCount > 0 && (
        <AnimatePresence mode="wait">
          {showSaveDialog ? (
            <motion.div
              key="dialog"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl border bg-card"
            >
              <div className="space-y-3">
                <Input
                  placeholder={t('presetName')}
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSavePreset}
                    disabled={!presetName.trim()}
                    className="flex-1"
                  >
                    {t('save')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowSaveDialog(false)
                      setPresetName('')
                    }}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('savePreset')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <Separator />

      {/* Sound Grid */}
      {categories.map(({ id, labelKey }) => {
        const categorySounds = getSoundsByCategory(id)
        return (
          <div key={id}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              {t(labelKey as TranslationKey)}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {categorySounds.map((sound) => {
                const isActive = sound.id in activeSounds
                const volume = activeSounds[sound.id] ?? 0.5
                const soundName = soundNameKeys[sound.id] ? t(soundNameKeys[sound.id]) : sound.name

                return (
                  <motion.div
                    key={sound.id}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`
                        cursor-pointer transition-all overflow-hidden rounded-xl border
                        aspect-square flex flex-col items-center justify-center gap-1 relative
                        ${isActive
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50 bg-card'
                        }
                      `}
                      onClick={() => toggle(sound.id)}
                    >
                      <span className="text-2xl">{sound.icon}</span>
                      <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {soundName}
                      </span>

                      {/* Volume indicator */}
                      {isActive && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${volume * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Playing indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute top-2 end-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </div>

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
