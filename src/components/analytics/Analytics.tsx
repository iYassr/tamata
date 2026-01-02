import { useEffect } from 'react'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { DailyStats } from './DailyStats'
import { WeeklyChart } from './WeeklyChart'
import { StreakCounter } from './StreakCounter'
import { InsightsPanel } from './InsightsPanel'
import { useLanguage } from '@/contexts/LanguageContext'

export function Analytics() {
  const { todayStats, weeklyData, insights, isLoading, refreshAll } = useAnalyticsStore()
  const { t } = useLanguage()

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
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('today')}</h3>
        <DailyStats stats={todayStats} />
      </div>

      <StreakCounter
        currentStreak={insights.currentStreak}
        longestStreak={insights.longestStreak}
      />

      <WeeklyChart data={weeklyData} />

      <InsightsPanel insights={insights} />
    </div>
  )
}
