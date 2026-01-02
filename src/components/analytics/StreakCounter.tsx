import { Flame, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <motion.div
        className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{currentStreak}</div>
            <div className="text-xs text-zinc-500">Day Streak</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl border border-yellow-500/20"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{longestStreak}</div>
            <div className="text-xs text-zinc-500">Best Streak</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
