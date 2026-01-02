import { create } from 'zustand'
import type { TimerMode, TimerState } from '../types'
import { useSettingsStore } from './settingsStore'

interface TimerStore extends TimerState {
  // Actions
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  complete: () => void
  setMode: (mode: TimerMode) => void

  // Derived
  getDurationForMode: (mode: TimerMode) => number
  getNextMode: () => TimerMode
}

function getDurationFromSettings(mode: TimerMode): number {
  const settings = useSettingsStore.getState()
  switch (mode) {
    case 'work':
      return settings.workDuration * 60
    case 'shortBreak':
      return settings.shortBreakDuration * 60
    case 'longBreak':
      return settings.longBreakDuration * 60
  }
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  mode: 'work',
  status: 'idle',
  timeRemaining: getDurationFromSettings('work'),
  currentSession: 1,
  totalSessions: 0,

  start: () => set({ status: 'running' }),

  pause: () => set({ status: 'paused' }),

  reset: () => {
    const { mode } = get()
    set({
      status: 'idle',
      timeRemaining: getDurationFromSettings(mode)
    })
  },

  skip: () => {
    const { mode, currentSession } = get()
    const settings = useSettingsStore.getState()

    let nextMode: TimerMode
    let nextSession = currentSession

    if (mode === 'work') {
      // After work, take a break
      if (currentSession >= settings.longBreakInterval) {
        nextMode = 'longBreak'
      } else {
        nextMode = 'shortBreak'
      }
    } else {
      // After any break, go back to work
      nextMode = 'work'
      if (mode === 'longBreak') {
        nextSession = 1 // Reset session counter after long break
      } else {
        nextSession = currentSession + 1
      }
    }

    set({
      mode: nextMode,
      status: 'idle',
      timeRemaining: getDurationFromSettings(nextMode),
      currentSession: nextSession
    })
  },

  tick: () => {
    const { timeRemaining } = get()
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 })
    }
  },

  complete: () => {
    const { mode, currentSession, totalSessions } = get()
    const settings = useSettingsStore.getState()

    let nextMode: TimerMode
    let nextSession = currentSession
    let newTotalSessions = totalSessions

    if (mode === 'work') {
      newTotalSessions = totalSessions + 1
      // After work, take a break
      if (currentSession >= settings.longBreakInterval) {
        nextMode = 'longBreak'
      } else {
        nextMode = 'shortBreak'
      }
    } else {
      // After any break, go back to work
      nextMode = 'work'
      if (mode === 'longBreak') {
        nextSession = 1 // Reset session counter after long break
      } else {
        nextSession = currentSession + 1
      }
    }

    const shouldAutoStart =
      (nextMode !== 'work' && settings.autoStartBreaks) ||
      (nextMode === 'work' && settings.autoStartWork)

    set({
      mode: nextMode,
      status: shouldAutoStart ? 'running' : 'idle',
      timeRemaining: getDurationFromSettings(nextMode),
      currentSession: nextSession,
      totalSessions: newTotalSessions
    })
  },

  setMode: (mode) => {
    set({
      mode,
      status: 'idle',
      timeRemaining: getDurationFromSettings(mode)
    })
  },

  getDurationForMode: (mode) => getDurationFromSettings(mode),

  getNextMode: () => {
    const { mode, currentSession } = get()
    const settings = useSettingsStore.getState()

    if (mode === 'work') {
      return currentSession >= settings.longBreakInterval ? 'longBreak' : 'shortBreak'
    }
    return 'work'
  }
}))
