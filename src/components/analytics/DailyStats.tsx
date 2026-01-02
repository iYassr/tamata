import { Clock, Target, Coffee } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatMinutes } from '../../lib/utils'
import type { DailyStats as DailyStatsType } from '../../types'

interface DailyStatsProps {
  stats: DailyStatsType
}

export function DailyStats({ stats }: DailyStatsProps) {
  const focusMinutes = Math.round(stats.focusTime / 60)
  const breakMinutes = Math.round(stats.breakTime / 60)

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="text-center">
        <div className="flex justify-center mb-2">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="text-2xl font-bold">{formatMinutes(focusMinutes)}</div>
        <div className="text-xs text-muted-foreground">Focus Time</div>
      </Card>

      <Card className="text-center">
        <div className="flex justify-center mb-2">
          <Target className="w-5 h-5 text-success" />
        </div>
        <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
        <div className="text-xs text-muted-foreground">Sessions</div>
      </Card>

      <Card className="text-center">
        <div className="flex justify-center mb-2">
          <Coffee className="w-5 h-5 text-warning" />
        </div>
        <div className="text-2xl font-bold">{formatMinutes(breakMinutes)}</div>
        <div className="text-xs text-muted-foreground">Break Time</div>
      </Card>
    </div>
  )
}
