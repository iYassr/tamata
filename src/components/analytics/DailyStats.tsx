import { Clock, Target, Coffee } from 'lucide-react'
import { formatMinutes } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { DailyStats as DailyStatsType } from '@/types'

interface DailyStatsProps {
  stats: DailyStatsType
}

export function DailyStats({ stats }: DailyStatsProps) {
  const focusMinutes = Math.round(stats.focusTime / 60)
  const breakMinutes = Math.round(stats.breakTime / 60)

  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard
        icon={<Clock className="w-4 h-4" />}
        value={formatMinutes(focusMinutes)}
        label="Focus"
        color="orange"
      />
      <StatCard
        icon={<Target className="w-4 h-4" />}
        value={stats.sessionsCompleted.toString()}
        label="Sessions"
        color="green"
      />
      <StatCard
        icon={<Coffee className="w-4 h-4" />}
        value={formatMinutes(breakMinutes)}
        label="Break"
        color="blue"
      />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: 'orange' | 'green' | 'blue'
}) {
  const colorClasses = {
    orange: 'text-orange-500 bg-orange-500/10',
    green: 'text-green-500 bg-green-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  }

  return (
    <Card className="bg-card/50">
      <CardContent className="p-3">
        <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}
