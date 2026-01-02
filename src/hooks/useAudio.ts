import { useEffect, useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { audioGenerator } from '@/lib/audioGenerator'
import { getPresetById } from '@/lib/sounds'
import type { UserSoundPreset } from '@/types'

export function useAudio() {
  const { sound, setSoundVolume, toggleSound, applyPreset, clearAllSounds, setMasterVolume, saveUserPreset, deleteUserPreset, applyUserPreset } = useSettingsStore()

  // Update master volume
  useEffect(() => {
    audioGenerator.setMasterVolume(sound.masterVolume)
  }, [sound.masterVolume])

  // Update individual sound volumes and play/stop
  useEffect(() => {
    // Get all sound IDs we know about
    const allSoundIds = [
      'rain-light', 'rain-heavy', 'thunder',
      'forest', 'ocean', 'birds', 'fire', 'wind',
      'cafe', 'library', 'train', 'typing',
      'white-noise', 'pink-noise', 'brown-noise'
    ]

    allSoundIds.forEach(soundId => {
      const volume = sound.activeSounds[soundId]

      if (volume !== undefined && volume > 0) {
        // Sound should be playing
        const effectiveVolume = volume * sound.masterVolume
        audioGenerator.play(soundId, effectiveVolume)
      } else {
        // Sound should be stopped
        audioGenerator.stop(soundId)
      }
    })
  }, [sound.activeSounds, sound.masterVolume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioGenerator.stopAll()
    }
  }, [])

  const setVolume = useCallback((soundId: string, volume: number) => {
    setSoundVolume(soundId, volume)
  }, [setSoundVolume])

  const toggle = useCallback((soundId: string) => {
    toggleSound(soundId)
  }, [toggleSound])

  const selectPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId)
    if (preset) {
      // Stop all current sounds first
      audioGenerator.stopAll()
      applyPreset(presetId, preset.sounds)
    }
  }, [applyPreset])

  const stopAll = useCallback(() => {
    audioGenerator.stopAll()
    clearAllSounds()
  }, [clearAllSounds])

  const savePreset = useCallback((name: string) => {
    saveUserPreset(name)
  }, [saveUserPreset])

  const deletePreset = useCallback((presetId: string) => {
    deleteUserPreset(presetId)
  }, [deleteUserPreset])

  const selectUserPreset = useCallback((preset: UserSoundPreset) => {
    audioGenerator.stopAll()
    applyUserPreset(preset)
  }, [applyUserPreset])

  return {
    activeSounds: sound.activeSounds,
    masterVolume: sound.masterVolume,
    currentPreset: sound.preset,
    userPresets: sound.userPresets,
    setVolume,
    toggle,
    selectPreset,
    stopAll,
    setMasterVolume,
    savePreset,
    deletePreset,
    selectUserPreset
  }
}
