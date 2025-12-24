import { useMemo } from 'react';
import { DailyEntry, formatDate } from '@/types/habits';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface YearlyHeatmapProps {
  entries: DailyEntry[];
  year?: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getColorForScore = (score: number | undefined): string => {
  if (score === undefined) return 'bg-secondary/30';
  if (score >= 90) return 'bg-success';
  if (score >= 70) return 'bg-success/70';
  if (score >= 50) return 'bg-primary/70';
  if (score >= 30) return 'bg-primary/40';
  if (score > 0) return 'bg-primary/20';
  return 'bg-secondary/30';
};

const YearlyHeatmap = ({ entries, year = 2026 }: YearlyHeatmapProps) => {
  const entryMap = useMemo(() => {
    const map: Record<string, DailyEntry> = {};
    entries.forEach(entry => {
      map[entry.date] = entry;
    });
    return map;
  }, [entries]);

  const weeks = useMemo(() => {
    const result: { date: Date; dateStr: string }[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Adjust start to the first Sunday
    const firstDay = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - firstDay);
    
    let currentDate = new Date(adjustedStart);
    let currentWeek: { date: Date; dateStr: string }[] = [];
    
    while (currentDate <= endDate || currentWeek.length > 0) {
      currentWeek.push({
        date: new Date(currentDate),
        dateStr: formatDate(currentDate),
      });
      
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentDate > endDate && currentWeek.length === 0) break;
    }
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [year]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(d => d.date.getFullYear() === year);
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks, year]);

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {year} Consistency Heatmap
      </h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-2 ml-8">
            {monthLabels.map(({ month, weekIndex }) => (
              <div 
                key={`${month}-${weekIndex}`}
                className="text-xs text-muted-foreground"
                style={{ 
                  position: 'absolute',
                  left: `${weekIndex * 14 + 32}px`
                }}
              >
                {month}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1 mt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {DAYS.map((day, idx) => (
                <div 
                  key={day} 
                  className="h-3 text-[10px] text-muted-foreground flex items-center"
                  style={{ visibility: idx % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map(({ date, dateStr }) => {
                    const entry = entryMap[dateStr];
                    const isCurrentYear = date.getFullYear() === year;
                    const score = entry?.disciplineScore;
                    
                    return (
                      <Tooltip key={dateStr}>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-3 h-3 rounded-sm transition-colors ${
                              isCurrentYear ? getColorForScore(score) : 'bg-transparent'
                            }`}
                          />
                        </TooltipTrigger>
                        {isCurrentYear && (
                          <TooltipContent>
                            <div className="text-xs">
                              <div className="font-medium">
                                {date.toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              {score !== undefined ? (
                                <div>Score: {score}%</div>
                              ) : (
                                <div className="text-muted-foreground">No data</div>
                              )}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-secondary/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/70" />
              <div className="w-3 h-3 rounded-sm bg-success/70" />
              <div className="w-3 h-3 rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;
