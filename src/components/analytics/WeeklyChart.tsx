import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import type { WeeklyData } from '@/types'

interface WeeklyChartProps {
  data: WeeklyData[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        This Week
      </h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
              formatter={(value) => [`${value} min`, 'Focus']}
              cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
            />
            <Bar dataKey="focusMinutes" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === today ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
