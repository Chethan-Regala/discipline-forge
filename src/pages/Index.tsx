import { useHabitData } from '@/hooks/useHabitData';
import { isToday } from '@/types/habits';
import IdentityHeader from '@/components/IdentityHeader';
import HabitChecklist from '@/components/HabitChecklist';
import DisciplineScore from '@/components/DisciplineScore';
import DailyReflection from '@/components/DailyReflection';
import SleepChart from '@/components/charts/SleepChart';
import HabitPieChart from '@/components/charts/HabitPieChart';
import StudyBarChart from '@/components/charts/StudyBarChart';
import YearlyHeatmap from '@/components/charts/YearlyHeatmap';
import NotificationSettings from '@/components/NotificationSettings';

const Index = () => {
  const {
    currentEntry,
    updateEntry,
    getAllEntries,
    getWeekEntries,
    getMonthEntries,
    getEntry,
    isLoading,
  } = useHabitData();

  const isEditable = isToday(currentEntry.date);
  const allEntries = getAllEntries();
  const weekEntries = getWeekEntries();
  const monthEntries = getMonthEntries();
  
  // Get yesterday's entry for trend comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayEntry = getEntry(yesterday.toISOString().split('T')[0]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-20 sm:pb-16 pt-2 sm:pt-4">
        <IdentityHeader />
        
        <main className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          {/* Daily Score */}
          <DisciplineScore 
            score={currentEntry.disciplineScore} 
            previousScore={yesterdayEntry?.disciplineScore}
          />
          
          {/* Habit Checklist */}
          <HabitChecklist 
            entry={currentEntry}
            onUpdate={updateEntry}
            isEditable={isEditable}
          />
          
          {/* Data Visualizations */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Analytics & Progress
            </h2>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <SleepChart entries={allEntries} />
              <HabitPieChart weekEntries={weekEntries} monthEntries={monthEntries} />
            </div>
            
            <StudyBarChart weekEntries={weekEntries} monthEntries={monthEntries} />
            
            <YearlyHeatmap entries={allEntries} year={2026} />
          </section>
          
          {/* Daily Reflection */}
          <DailyReflection 
            value={currentEntry.reflectionText}
            onChange={(value) => updateEntry({ reflectionText: value })}
            isEditable={isEditable}
          />
          
          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground pt-6 sm:pt-8 border-t border-border">
            <p>2026 Discipline OS • Built for long-term consistency</p>
            <p className="mt-1 italic">"The man who conquers himself is greater than the one who conquers a thousand battles."</p>
          </footer>
        </main>
      </div>
      
      {/* Notification Settings Button */}
      <NotificationSettings />
    </div>
  );
};

export default Index;
