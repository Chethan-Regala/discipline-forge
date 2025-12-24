import { useMemo } from 'react';
import { DailyEntry, formatDate } from '@/types/habits';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface YearlyHeatmapProps {
  entries: DailyEntry[];
  year?: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Smooth color gradient function similar to GitHub/LeetCode
const getColorForScore = (score: number | undefined, intensity: number = 1): string => {
  if (score === undefined || score === 0) return 'bg-secondary/20';
  
  // Create smooth gradient based on score (0-100)
  if (score >= 90) return 'bg-success';
  if (score >= 80) return 'bg-success/90';
  if (score >= 70) return 'bg-success/75';
  if (score >= 60) return 'bg-primary/80';
  if (score >= 50) return 'bg-primary/65';
  if (score >= 40) return 'bg-primary/50';
  if (score >= 30) return 'bg-primary/40';
  if (score >= 20) return 'bg-primary/30';
  if (score >= 10) return 'bg-primary/25';
  return 'bg-primary/20';
};

// Get intensity level for hover effects
const getIntensityLevel = (score: number | undefined): number => {
  if (score === undefined || score === 0) return 0;
  if (score >= 90) return 4;
  if (score >= 70) return 3;
  if (score >= 50) return 2;
  if (score >= 30) return 1;
  return 0.5;
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
    <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
        {year} Consistency Heatmap
      </h3>
      
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="min-w-max pb-2">
          {/* Month labels */}
          <div className="flex mb-2 ml-6 sm:ml-8 relative" style={{ height: '20px' }}>
            {monthLabels.map(({ month, weekIndex }, idx) => {
              const leftPosition = weekIndex * 14 + 24;
              const nextLabel = monthLabels[idx + 1];
              const availableWidth = nextLabel ? (nextLabel.weekIndex - weekIndex) * 14 : 20;
              
              return (
                <div 
                  key={`${month}-${weekIndex}`}
                  className="text-[10px] sm:text-xs text-muted-foreground absolute"
                  style={{ 
                    left: `${leftPosition}px`,
                    maxWidth: `${Math.max(availableWidth, 20)}px`,
                    overflow: 'visible',
                    whiteSpace: 'nowrap'
                  }}
                  title={month}
                >
                  {month}
                </div>
              );
            })}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1 mt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {DAYS.map((day, idx) => (
                <div 
                  key={day} 
                  className="h-3 text-[9px] sm:text-[10px] text-muted-foreground flex items-center"
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
                    const intensity = getIntensityLevel(score);
                    const isToday = dateStr === formatDate(new Date());
                    
                    return (
                      <Tooltip key={dateStr}>
                        <TooltipTrigger asChild>
                          <div 
                            className={`
                              w-3 h-3 rounded-sm 
                              transition-all duration-200 ease-in-out
                              cursor-pointer
                              hover:scale-125 hover:z-10 hover:ring-2 hover:ring-foreground/20
                              ${isCurrentYear ? getColorForScore(score, intensity) : 'bg-transparent'}
                              ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                            `}
                            style={{
                              transform: 'scale(1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.3)';
                              e.currentTarget.style.zIndex = '10';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.zIndex = '1';
                            }}
                          />
                        </TooltipTrigger>
                        {isCurrentYear && (
                          <TooltipContent side="top" className="mb-2">
                            <div className="text-xs space-y-1">
                              <div className="font-semibold">
                                {date.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              {score !== undefined && score > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Discipline Score:</span>
                                  <span className="font-medium">{score}%</span>
                                </div>
                              ) : (
                                <div className="text-muted-foreground">No data recorded</div>
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
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-secondary/20 transition-transform hover:scale-125" title="No data" />
                <div className="w-3 h-3 rounded-sm bg-primary/20 transition-transform hover:scale-125" title="0-20%" />
                <div className="w-3 h-3 rounded-sm bg-primary/40 transition-transform hover:scale-125" title="30-50%" />
                <div className="w-3 h-3 rounded-sm bg-primary/70 transition-transform hover:scale-125" title="60-80%" />
                <div className="w-3 h-3 rounded-sm bg-success/75 transition-transform hover:scale-125" title="80-90%" />
                <div className="w-3 h-3 rounded-sm bg-success transition-transform hover:scale-125" title="90-100%" />
              </div>
              <span>More</span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {entries.filter(e => e.disciplineScore > 0).length} days with data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;
