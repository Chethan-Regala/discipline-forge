import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { DailyEntry } from '@/types/habits';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StudyBarChartProps {
  weekEntries: DailyEntry[];
  monthEntries: DailyEntry[];
}

const StudyBarChart = ({ weekEntries, monthEntries }: StudyBarChartProps) => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const entries = view === 'week' ? weekEntries : monthEntries;

  // Calculate statistics and prepare data
  const { data, stats } = useMemo(() => {
    const chartData = entries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: entry.date,
      studyHours: Number(entry.studyHours.toFixed(1)),
      problemsSolved: entry.problemsSolved,
    }));

    // Calculate statistics
    const studyHours = entries.map(e => e.studyHours);
    const problemsSolved = entries.map(e => e.problemsSolved);
    
    const avgStudyHours = studyHours.length > 0 
      ? studyHours.reduce((a, b) => a + b, 0) / studyHours.length 
      : 0;
    const avgProblems = problemsSolved.length > 0
      ? problemsSolved.reduce((a, b) => a + b, 0) / problemsSolved.length
      : 0;
    
    const totalStudyHours = studyHours.reduce((a, b) => a + b, 0);
    const totalProblems = problemsSolved.reduce((a, b) => a + b, 0);
    
    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(entries.length / 2);
    const firstHalfStudy = studyHours.slice(0, midPoint).reduce((a, b) => a + b, 0) / Math.max(midPoint, 1);
    const secondHalfStudy = studyHours.slice(midPoint).reduce((a, b) => a + b, 0) / Math.max(studyHours.length - midPoint, 1);
    const studyTrend = secondHalfStudy - firstHalfStudy;
    
    const firstHalfProblems = problemsSolved.slice(0, midPoint).reduce((a, b) => a + b, 0) / Math.max(midPoint, 1);
    const secondHalfProblems = problemsSolved.slice(midPoint).reduce((a, b) => a + b, 0) / Math.max(problemsSolved.length - midPoint, 1);
    const problemsTrend = secondHalfProblems - firstHalfProblems;

    // Normalize Y-axis for better visualization (using dual Y-axis approach)
    const maxStudyHours = Math.max(...studyHours, 1);
    const maxProblems = Math.max(...problemsSolved, 1);
    const scaleFactor = maxStudyHours > 0 ? maxProblems / maxStudyHours : 1;

    return {
      data: chartData,
      stats: {
        avgStudyHours: Number(avgStudyHours.toFixed(1)),
        avgProblems: Number(avgProblems.toFixed(1)),
        totalStudyHours: Number(totalStudyHours.toFixed(1)),
        totalProblems,
        studyTrend: Number(studyTrend.toFixed(1)),
        problemsTrend: Number(problemsTrend.toFixed(1)),
        scaleFactor,
      }
    };
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Study & Productivity</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Start tracking to see your study data
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Study & Productivity</h3>
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setView('week')}
            className="text-xs sm:text-sm"
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setView('month')}
            className="text-xs sm:text-sm"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Avg Study Hours</div>
          <div className="text-sm font-semibold text-foreground">{stats.avgStudyHours}h</div>
          {stats.studyTrend !== 0 && (
            <div className={`flex items-center gap-1 text-[10px] mt-1 ${stats.studyTrend > 0 ? 'text-success' : 'text-destructive'}`}>
              {stats.studyTrend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(stats.studyTrend).toFixed(1)}h
            </div>
          )}
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Avg Problems</div>
          <div className="text-sm font-semibold text-foreground">{stats.avgProblems}</div>
          {stats.problemsTrend !== 0 && (
            <div className={`flex items-center gap-1 text-[10px] mt-1 ${stats.problemsTrend > 0 ? 'text-success' : 'text-destructive'}`}>
              {stats.problemsTrend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(stats.problemsTrend).toFixed(1)}
            </div>
          )}
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Total Study Hours</div>
          <div className="text-sm font-semibold text-foreground">{stats.totalStudyHours}h</div>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Total Problems</div>
          <div className="text-sm font-semibold text-foreground">{stats.totalProblems}</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--chart-study))" 
              fontSize={10}
              tickLine={false}
              width={40}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: '11px' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--primary))" 
              fontSize={10}
              tickLine={false}
              width={40}
              label={{ value: 'Problems', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: '11px' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                padding: '8px 12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Study Hours') return [`${value}h`, name];
                return [value, name];
              }}
            />
            <Legend 
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '11px' }}>{value}</span>}
            />
            <ReferenceLine 
              yAxisId="left"
              y={stats.avgStudyHours} 
              stroke="hsl(var(--chart-study))" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
              label={{ value: 'Avg', position: 'right', style: { fill: 'hsl(var(--muted-foreground))', fontSize: '10px' } }}
            />
            <Bar 
              yAxisId="left"
              dataKey="studyHours" 
              name="Study Hours" 
              fill="hsl(var(--chart-study))" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Bar 
              yAxisId="right"
              dataKey="problemsSolved" 
              name="Problems Solved" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudyBarChart;
