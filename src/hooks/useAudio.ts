import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useSettingsStore } from '../stores/settingsStore'
import { sounds as soundList, getPresetById } from '../lib/sounds'

interface HowlInstance {
  howl: Howl
  id: number | undefined
}

export function useAudio() {
  const howlsRef = useRef<Map<string, HowlInstance>>(new Map())
  const { sound, setSoundVolume, toggleSound, applyPreset, clearAllSounds, setMasterVolume } = useSettingsStore()

  // Initialize all sounds
  useEffect(() => {
    soundList.forEach(s => {
      const howl = new Howl({
        src: [s.src],
        loop: s.loop,
        volume: 0,
        preload: true,
        html5: true // Better for long audio files
      })
      howlsRef.current.set(s.id, { howl, id: undefined })
    })

    return () => {
      howlsRef.current.forEach(({ howl }) => {
        howl.unload()
      })
      howlsRef.current.clear()
    }
  }, [])

  // Update volumes and play/stop based on active sounds
  useEffect(() => {
    howlsRef.current.forEach((instance, soundId) => {
      const volume = sound.activeSounds[soundId]
      const effectiveVolume = volume !== undefined ? volume * sound.masterVolume : 0

      if (effectiveVolume > 0) {
        instance.howl.volume(effectiveVolume)
        if (!instance.howl.playing()) {
          instance.id = instance.howl.play()
        }
      } else {
        if (instance.howl.playing()) {
          instance.howl.fade(instance.howl.volume(), 0, 300)
          setTimeout(() => {
            instance.howl.stop()
          }, 300)
        }
      }
    })
  }, [sound.activeSounds, sound.masterVolume])

  const setVolume = useCallback((soundId: string, volume: number) => {
    setSoundVolume(soundId, volume)
  }, [setSoundVolume])

  const toggle = useCallback((soundId: string) => {
    toggleSound(soundId)
  }, [toggleSound])

  const selectPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId)
    if (preset) {
      applyPreset(presetId, preset.sounds)
    }
  }, [applyPreset])

  const stopAll = useCallback(() => {
    clearAllSounds()
  }, [clearAllSounds])

  return {
    activeSounds: sound.activeSounds,
    masterVolume: sound.masterVolume,
    currentPreset: sound.preset,
    setVolume,
    toggle,
    selectPreset,
    stopAll,
    setMasterVolume
  }
}
