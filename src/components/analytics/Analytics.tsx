import { useEffect } from 'react'
import { useAnalyticsStore } from '../../stores/analyticsStore'
import { DailyStats } from './DailyStats'
import { WeeklyChart } from './WeeklyChart'
import { StreakCounter } from './StreakCounter'
import { InsightsPanel } from './InsightsPanel'

export function Analytics() {
  const { todayStats, weeklyData, insights, isLoading, refreshAll } = useAnalyticsStore()

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Today</h2>
      <DailyStats stats={todayStats} />

      <StreakCounter
        currentStreak={insights.currentStreak}
        longestStreak={insights.longestStreak}
      />

      <WeeklyChart data={weeklyData} />

      <InsightsPanel insights={insights} />
    </div>
  )
}
