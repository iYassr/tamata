import { Flame, Trophy } from 'lucide-react'
import { Card } from '../ui/Card'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-bold">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
      </Card>

      <Card className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-warning/10">
          <Trophy className="w-5 h-5 text-warning" />
        </div>
        <div>
          <div className="text-2xl font-bold">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
      </Card>
    </div>
  )
}
