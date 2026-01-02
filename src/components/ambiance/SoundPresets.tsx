import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { presets } from '@/lib/sounds'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/lib/i18n'

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

const presetNameKeys: Record<string, TranslationKey> = {
  'rainy-cafe': 'rainyCafe',
  'forest-retreat': 'forestRetreat',
  'cozy-fire': 'cozyFire',
  'ocean-breeze': 'oceanBreeze',
  'deep-focus': 'deepFocus',
  'lofi-rain': 'lofiRain'
}

export function SoundPresets({ currentPreset, onSelectPreset }: SoundPresetsProps) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('quickPresets')}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const isActive = currentPreset === preset.id
          const presetName = presetNameKeys[preset.id] ? t(presetNameKeys[preset.id]) : preset.name

          return (
            <motion.div
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`
                  cursor-pointer transition-all overflow-hidden rounded-xl border p-3 relative
                  ${isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50 bg-card'
                  }
                `}
                onClick={() => onSelectPreset(preset.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{presetIcons[preset.id] || '🎵'}</span>
                  <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {presetName}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activePreset"
                    className="absolute inset-0 border-2 border-primary/50 rounded-xl pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
