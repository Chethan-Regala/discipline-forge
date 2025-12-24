import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DailyEntry } from '@/types/habits';
import { Button } from '@/components/ui/button';

interface HabitPieChartProps {
  weekEntries: DailyEntry[];
  monthEntries: DailyEntry[];
}

const CATEGORIES = [
  { key: 'sleep', label: 'Sleep', color: 'hsl(var(--chart-sleep))' },
  { key: 'exercise', label: 'Exercise & Meditation', color: 'hsl(var(--chart-exercise))' },
  { key: 'nutrition', label: 'Nutrition', color: 'hsl(var(--chart-nutrition))' },
  { key: 'study', label: 'Study & Growth', color: 'hsl(var(--chart-study))' },
  { key: 'problemSolving', label: 'Problem Solving', color: 'hsl(var(--primary))' },
  { key: 'university', label: 'University', color: 'hsl(var(--chart-spiritual))' },
  { key: 'spiritual', label: 'Spiritual', color: 'hsl(var(--warning))' },
  { key: 'discipline', label: 'Discipline', color: 'hsl(var(--chart-discipline))' },
];

const calculateCategoryCompletion = (entries: DailyEntry[]) => {
  if (entries.length === 0) return CATEGORIES.map(c => ({ ...c, value: 0 }));

  const totals = {
    sleep: 0,
    exercise: 0,
    nutrition: 0,
    study: 0,
    problemSolving: 0,
    university: 0,
    spiritual: 0,
    discipline: 0,
  };

  entries.forEach(entry => {
    if (entry.sleepHours >= 6 && entry.sleepHours <= 7) totals.sleep++;
    if (entry.exercised && entry.meditated) totals.exercise++;
    else if (entry.exercised || entry.meditated) totals.exercise += 0.5;
    
    const nutritionScore = [entry.breakfast, entry.lunch, entry.dinner].filter(Boolean).length / 3;
    totals.nutrition += nutritionScore;
    
    if (entry.studyHours >= 2) totals.study++;
    if (entry.problemsSolved > 0) totals.problemSolving++;
    
    const uniScore = [entry.universityAttended, entry.universityRevised].filter(Boolean).length / 2;
    totals.university += uniScore;
    
    const spiritScore = [entry.morningFreshUp, entry.spiritualPractice].filter(Boolean).length / 2;
    totals.spiritual += spiritScore;
    
    if (entry.disciplineCheck) totals.discipline++;
  });

  return CATEGORIES.map(cat => ({
    ...cat,
    value: Math.round((totals[cat.key as keyof typeof totals] / entries.length) * 100),
  }));
};

const HabitPieChart = ({ weekEntries, monthEntries }: HabitPieChartProps) => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const entries = view === 'week' ? weekEntries : monthEntries;
  const data = calculateCategoryCompletion(entries);

  if (entries.length === 0) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Habit Completion</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Start tracking to see your habit completion
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Habit Completion</h3>
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
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`${value}%`, 'Completion']}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitPieChart;
