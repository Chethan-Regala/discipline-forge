import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyEntry } from '@/types/habits';
import { Button } from '@/components/ui/button';

interface StudyBarChartProps {
  weekEntries: DailyEntry[];
  monthEntries: DailyEntry[];
}

const StudyBarChart = ({ weekEntries, monthEntries }: StudyBarChartProps) => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const entries = view === 'week' ? weekEntries : monthEntries;

  const data = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    studyHours: entry.studyHours,
    problemsSolved: entry.problemsSolved,
  }));

  if (data.length === 0) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Study & Productivity</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Start tracking to see your study data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Study & Productivity</h3>
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend 
              iconType="square"
              iconSize={10}
              formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>{value}</span>}
            />
            <Bar dataKey="studyHours" name="Study Hours" fill="hsl(var(--chart-study))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="problemsSolved" name="Problems Solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudyBarChart;
