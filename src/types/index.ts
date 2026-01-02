// Timer types
export type TimerMode = 'work' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  timeRemaining: number // in seconds
  currentSession: number // which pomodoro in the cycle (1-4)
  totalSessions: number // total completed work sessions today
}

// Settings types
export interface TimerSettings {
  workDuration: number // in minutes
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number // pomodoros before long break
  autoStartBreaks: boolean
  autoStartWork: boolean
}

export interface UserSoundPreset {
  id: string
  name: string
  sounds: Record<string, number>
}

export interface SoundSettings {
  masterVolume: number // 0-1
  activeSounds: Record<string, number> // soundId -> volume (0-1)
  preset: string | null
  userPresets: UserSoundPreset[]
}

export interface AppSettings extends TimerSettings {
  theme: 'light' | 'dark' | 'system'
  sound: SoundSettings
  notifications: boolean
}

// Session tracking types
export interface Session {
  id: string
  type: TimerMode
  duration: number // in seconds
  completedAt: Date
  interrupted: boolean
  tags?: string[]
}

export interface DailyStats {
  date: string // YYYY-MM-DD
  focusTime: number // total seconds
  breakTime: number
  sessionsCompleted: number
  sessionsInterrupted: number
  longestFocusStreak: number
}

// Sound types
export interface Sound {
  id: string
  name: string
  icon: string
  category: 'rain' | 'nature' | 'ambient' | 'noise'
}

export interface SoundPreset {
  id: string
  name: string
  sounds: Record<string, number> // soundId -> volume
}

// Analytics types
export interface WeeklyData {
  day: string
  focusMinutes: number
  sessions: number
}

export interface InsightData {
  bestHour: number // 0-23
  averageDailyFocus: number // minutes
  currentStreak: number // days
  longestStreak: number // days
  totalFocusTime: number // minutes all time
  totalSessions: number
}

// Worker message types
export interface TimerWorkerMessage {
  type: 'start' | 'pause' | 'reset' | 'tick' | 'complete'
  payload?: {
    duration?: number
    remaining?: number
  }
}
