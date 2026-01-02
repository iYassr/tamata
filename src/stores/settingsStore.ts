import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, SoundSettings } from '../types'

const defaultSoundSettings: SoundSettings = {
  masterVolume: 0.7,
  activeSounds: {},
  preset: null
}

const defaultSettings: AppSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  theme: 'dark',
  sound: defaultSoundSettings,
  notifications: true
}

interface SettingsStore extends AppSettings {
  setWorkDuration: (minutes: number) => void
  setShortBreakDuration: (minutes: number) => void
  setLongBreakDuration: (minutes: number) => void
  setLongBreakInterval: (count: number) => void
  setAutoStartBreaks: (enabled: boolean) => void
  setAutoStartWork: (enabled: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setNotifications: (enabled: boolean) => void
  setMasterVolume: (volume: number) => void
  setSoundVolume: (soundId: string, volume: number) => void
  toggleSound: (soundId: string) => void
  applyPreset: (presetId: string, sounds: Record<string, number>) => void
  clearAllSounds: () => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setWorkDuration: (minutes) => set({ workDuration: minutes }),
      setShortBreakDuration: (minutes) => set({ shortBreakDuration: minutes }),
      setLongBreakDuration: (minutes) => set({ longBreakDuration: minutes }),
      setLongBreakInterval: (count) => set({ longBreakInterval: count }),
      setAutoStartBreaks: (enabled) => set({ autoStartBreaks: enabled }),
      setAutoStartWork: (enabled) => set({ autoStartWork: enabled }),
      setTheme: (theme) => set({ theme }),
      setNotifications: (enabled) => set({ notifications: enabled }),

      setMasterVolume: (volume) => set((state) => ({
        sound: { ...state.sound, masterVolume: volume }
      })),

      setSoundVolume: (soundId, volume) => set((state) => ({
        sound: {
          ...state.sound,
          activeSounds: { ...state.sound.activeSounds, [soundId]: volume },
          preset: null // Clear preset when manually adjusting
        }
      })),

      toggleSound: (soundId) => set((state) => {
        const newSounds = { ...state.sound.activeSounds }
        if (soundId in newSounds) {
          delete newSounds[soundId]
        } else {
          newSounds[soundId] = 0.5 // Default volume
        }
        return {
          sound: { ...state.sound, activeSounds: newSounds, preset: null }
        }
      }),

      applyPreset: (presetId, sounds) => set((state) => ({
        sound: { ...state.sound, activeSounds: sounds, preset: presetId }
      })),

      clearAllSounds: () => set((state) => ({
        sound: { ...state.sound, activeSounds: {}, preset: null }
      })),

      resetSettings: () => set(defaultSettings)
    }),
    {
      name: 'tamata-settings'
    }
  )
)
