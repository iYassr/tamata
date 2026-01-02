import { TrendingUp, Clock, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { formatMinutes } from '../../lib/utils'
import type { InsightData } from '../../types'

interface InsightsPanelProps {
  insights: InsightData
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Total Focus Time</span>
          </div>
          <span className="font-medium">{formatMinutes(insights.totalFocusTime)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Total Sessions</span>
          </div>
          <span className="font-medium">{insights.totalSessions}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Daily Average</span>
          </div>
          <span className="font-medium">{formatMinutes(insights.averageDailyFocus)}</span>
        </div>

        {insights.totalSessions > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              You've completed <span className="text-foreground font-medium">{insights.totalSessions} sessions</span> with an average of{' '}
              <span className="text-foreground font-medium">{formatMinutes(insights.averageDailyFocus)}</span> focus time per day.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
