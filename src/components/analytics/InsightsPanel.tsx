import { TrendingUp, Clock, Zap } from 'lucide-react'
import { formatMinutes } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import type { InsightData } from '@/types'

interface InsightsPanelProps {
  insights: InsightData
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5" />
        All-Time Stats
      </h3>

      <div className="space-y-3">
        <InsightRow
          icon={<Clock className="w-4 h-4 text-orange-500" />}
          label="Total Focus Time"
          value={formatMinutes(insights.totalFocusTime)}
        />
        <InsightRow
          icon={<Zap className="w-4 h-4 text-yellow-500" />}
          label="Total Sessions"
          value={insights.totalSessions.toString()}
        />
        <InsightRow
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          label="Daily Average"
          value={formatMinutes(insights.averageDailyFocus)}
        />
      </div>

      {insights.totalSessions > 0 && (
        <>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            You've completed{' '}
            <span className="text-foreground font-medium">{insights.totalSessions} sessions</span>
            {' '}with an average of{' '}
            <span className="text-foreground font-medium">{formatMinutes(insights.averageDailyFocus)}</span>
            {' '}focus time per day.
          </p>
        </>
      )}
    </div>
  )
}

function InsightRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
