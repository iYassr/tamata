import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import { getSoundsByCategory } from '../../lib/sounds'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Slider } from '../ui/Slider'
import { SoundCard } from './SoundCard'
import { SoundPresets } from './SoundPresets'

const categories = [
  { id: 'rain', label: 'Rain' },
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

  const hasActiveSounds = Object.keys(activeSounds).length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Ambient Sounds
        </CardTitle>
        {hasActiveSounds && (
          <Button variant="ghost" size="sm" onClick={stopAll}>
            <VolumeX className="w-4 h-4 mr-1" />
            Stop All
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Volume */}
        <div className="flex items-center gap-4">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={masterVolume}
            onValueChange={setMasterVolume}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>

        {/* Presets */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Presets</h4>
          <SoundPresets
            currentPreset={currentPreset}
            onSelectPreset={selectPreset}
          />
        </div>

        {/* Sound Categories */}
        {categories.map(({ id, label }) => {
          const categorySounds = getSoundsByCategory(id)
          return (
            <div key={id}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{label}</h4>
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
      </CardContent>
    </Card>
  )
}
