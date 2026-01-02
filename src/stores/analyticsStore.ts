import { create } from 'zustand'
import type { Session, DailyStats, InsightData, WeeklyData } from '../types'
import { db, saveSession, saveDailyStats, getWeeklyStats, getAllStats } from '../lib/db'
import { generateId, getToday, getWeekDates, getDayName } from '../lib/utils'

interface AnalyticsStore {
  todayStats: DailyStats
  weeklyData: WeeklyData[]
  insights: InsightData
  isLoading: boolean

  // Actions
  recordSession: (type: Session['type'], duration: number, interrupted?: boolean) => Promise<void>
  loadTodayStats: () => Promise<void>
  loadWeeklyData: () => Promise<void>
  loadInsights: () => Promise<void>
  refreshAll: () => Promise<void>
}

const emptyStats: DailyStats = {
  date: getToday(),
  focusTime: 0,
  breakTime: 0,
  sessionsCompleted: 0,
  sessionsInterrupted: 0,
  longestFocusStreak: 0
}

const emptyInsights: InsightData = {
  bestHour: 9,
  averageDailyFocus: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalFocusTime: 0,
  totalSessions: 0
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  todayStats: emptyStats,
  weeklyData: [],
  insights: emptyInsights,
  isLoading: true,

  recordSession: async (type, duration, interrupted = false) => {
    const session: Session = {
      id: generateId(),
      type,
      duration,
      completedAt: new Date(),
      interrupted
    }

    await saveSession(session)

    // Update today's stats
    const today = getToday()
    const { todayStats } = get()

    const updatedStats: DailyStats = {
      ...todayStats,
      date: today,
      focusTime: type === 'work' ? todayStats.focusTime + duration : todayStats.focusTime,
      breakTime: type !== 'work' ? todayStats.breakTime + duration : todayStats.breakTime,
      sessionsCompleted: interrupted ? todayStats.sessionsCompleted : todayStats.sessionsCompleted + 1,
      sessionsInterrupted: interrupted ? todayStats.sessionsInterrupted + 1 : todayStats.sessionsInterrupted
    }

    await saveDailyStats(updatedStats)
    set({ todayStats: updatedStats })

    // Refresh weekly data
    get().loadWeeklyData()
  },

  loadTodayStats: async () => {
    const today = getToday()
    const stats = await db.dailyStats.get(today)
    set({ todayStats: stats || { ...emptyStats, date: today } })
  },

  loadWeeklyData: async () => {
    const dates = getWeekDates()
    const stats = await getWeeklyStats(dates)

    const weeklyData: WeeklyData[] = dates.map(date => {
      const dayStat = stats.find(s => s.date === date)
      return {
        day: getDayName(date),
        focusMinutes: dayStat ? Math.round(dayStat.focusTime / 60) : 0,
        sessions: dayStat?.sessionsCompleted || 0
      }
    })

    set({ weeklyData })
  },

  loadInsights: async () => {
    const allStats = await getAllStats()

    if (allStats.length === 0) {
      set({ insights: emptyInsights })
      return
    }

    // Calculate total focus time and sessions
    const totalFocusTime = allStats.reduce((sum, s) => sum + s.focusTime, 0)
    const totalSessions = allStats.reduce((sum, s) => sum + s.sessionsCompleted, 0)

    // Calculate average daily focus
    const averageDailyFocus = Math.round(totalFocusTime / 60 / allStats.length)

    // Calculate current streak (consecutive days with at least 1 session)
    const sortedDates = allStats
      .map(s => s.date)
      .sort()
      .reverse()

    let currentStreak = 0
    let longestStreak = 0
    let streak = 0
    const today = getToday()

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i])
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++
        if (i === 0 || currentStreak > 0) {
          currentStreak = streak
        }
      } else {
        if (streak > longestStreak) {
          longestStreak = streak
        }
        streak = 0
      }
    }

    if (streak > longestStreak) {
      longestStreak = streak
    }

    set({
      insights: {
        bestHour: 9, // Could calculate from session timestamps
        averageDailyFocus,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalFocusTime: Math.round(totalFocusTime / 60),
        totalSessions
      }
    })
  },

  refreshAll: async () => {
    set({ isLoading: true })
    await Promise.all([
      get().loadTodayStats(),
      get().loadWeeklyData(),
      get().loadInsights()
    ])
    set({ isLoading: false })
  }
}))
