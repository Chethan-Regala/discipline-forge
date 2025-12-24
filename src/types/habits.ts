export interface DailyEntry {
  date: string; // YYYY-MM-DD
  sleepHours: number;
  exercised: boolean;
  meditated: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  problemsSolved: number;
  studyHours: number;
  universityAttended: boolean;
  universityRevised: boolean;
  morningFreshUp: boolean;
  spiritualPractice: boolean;
  disciplineCheck: boolean;
  disciplineScore: number;
  reflectionText: string;
}

export const createEmptyEntry = (date: string): DailyEntry => ({
  date,
  sleepHours: 0,
  exercised: false,
  meditated: false,
  breakfast: false,
  lunch: false,
  dinner: false,
  problemsSolved: 0,
  studyHours: 0,
  universityAttended: false,
  universityRevised: false,
  morningFreshUp: false,
  spiritualPractice: false,
  disciplineCheck: false,
  disciplineScore: 0,
  reflectionText: '',
});

export const calculateDisciplineScore = (entry: DailyEntry): number => {
  const checks = [
    entry.sleepHours >= 6 && entry.sleepHours <= 7,
    entry.exercised,
    entry.meditated,
    entry.breakfast,
    entry.lunch,
    entry.dinner,
    entry.problemsSolved > 0,
    entry.studyHours >= 2,
    entry.universityAttended,
    entry.universityRevised,
    entry.morningFreshUp,
    entry.spiritualPractice,
    entry.disciplineCheck,
  ];
  
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

export const getScoreMessage = (score: number): string => {
  if (score >= 90) return "Excellent discipline today";
  if (score >= 70) return "Consistency maintained";
  if (score >= 50) return "Room for improvement";
  if (score >= 30) return "Tomorrow is a new opportunity";
  return "Start fresh tomorrow";
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === formatDate(new Date());
};

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
