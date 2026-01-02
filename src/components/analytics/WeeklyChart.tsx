import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import type { WeeklyData } from '../../types'

interface WeeklyChartProps {
  data: WeeklyData[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">This Week</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ color: '#fafafa', marginBottom: '4px', fontWeight: 600 }}
              itemStyle={{ color: '#a1a1aa' }}
              formatter={(value) => [`${value} min`, 'Focus']}
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
            />
            <Bar dataKey="focusMinutes" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === today ? '#f97316' : '#3f3f46'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
