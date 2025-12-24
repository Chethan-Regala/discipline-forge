import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { DailyEntry } from '@/types/habits';

interface SleepChartProps {
  entries: DailyEntry[];
}

const SleepChart = ({ entries }: SleepChartProps) => {
  const data = entries.slice(-30).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: entry.sleepHours,
    optimal: entry.sleepHours >= 6 && entry.sleepHours <= 7,
  }));

  if (data.length === 0) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sleep Tracking</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Start tracking to see your sleep data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Sleep Tracking (Last 30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              domain={[0, 12]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {/* Optimal range highlight */}
            <ReferenceLine y={6} stroke="hsl(var(--success))" strokeDasharray="5 5" strokeOpacity={0.5} />
            <ReferenceLine y={7} stroke="hsl(var(--success))" strokeDasharray="5 5" strokeOpacity={0.5} />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="hsl(var(--chart-sleep))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-sleep))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(var(--chart-sleep))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-sleep" />
          <span>Hours slept</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-success opacity-50" style={{ borderStyle: 'dashed' }} />
          <span>Optimal range (6-7h)</span>
        </div>
      </div>
    </div>
  );
};

export default SleepChart;
