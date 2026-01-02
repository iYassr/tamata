import { TrendingUp, Clock, Zap } from 'lucide-react'
import { formatMinutes } from '../../lib/utils'
import type { InsightData } from '../../types'

interface InsightsPanelProps {
  insights: InsightData
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
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
        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          <p className="text-sm text-zinc-500 leading-relaxed">
            You've completed{' '}
            <span className="text-white font-medium">{insights.totalSessions} sessions</span>
            {' '}with an average of{' '}
            <span className="text-white font-medium">{formatMinutes(insights.averageDailyFocus)}</span>
            {' '}focus time per day.
          </p>
        </div>
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
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}
