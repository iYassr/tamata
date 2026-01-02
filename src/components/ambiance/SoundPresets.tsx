import { cn } from '../../lib/utils'
import { presets } from '../../lib/sounds'

interface SoundPresetsProps {
  currentPreset: string | null
  onSelectPreset: (presetId: string) => void
}

export function SoundPresets({ currentPreset, onSelectPreset }: SoundPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelectPreset(preset.id)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-all',
            currentPreset === preset.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted'
          )}
        >
          {preset.name}
        </button>
      ))}
    </div>
  )
}
