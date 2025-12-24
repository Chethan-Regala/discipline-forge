import { useState, useEffect, useCallback } from 'react';
import { DailyEntry, createEmptyEntry, calculateDisciplineScore, formatDate } from '@/types/habits';
import { getSupabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DailyEntryRow = Database['public']['Tables']['daily_entries']['Row'];
type DailyEntryInsert = Database['public']['Tables']['daily_entries']['Insert'];
type DailyEntryUpdate = Database['public']['Tables']['daily_entries']['Update'];

const STORAGE_KEY = 'discipline-os-2026';

// Convert Supabase row to DailyEntry
const rowToEntry = (row: DailyEntryRow): DailyEntry => ({
  date: row.date,
  sleepHours: row.sleep_hours,
  exercised: row.exercised,
  meditated: row.meditated,
  breakfast: row.breakfast,
  lunch: row.lunch,
  dinner: row.dinner,
  problemsSolved: row.problems_solved,
  studyHours: row.study_hours,
  universityAttended: row.university_attended,
  universityRevised: row.university_revised,
  morningFreshUp: row.morning_fresh_up,
  spiritualPractice: row.spiritual_practice,
  disciplineCheck: row.discipline_check,
  disciplineScore: row.discipline_score,
  reflectionText: row.reflection_text,
});

// Convert DailyEntry to Supabase insert
const entryToInsert = (entry: DailyEntry): DailyEntryInsert => ({
  date: entry.date,
  sleep_hours: entry.sleepHours,
  exercised: entry.exercised,
  meditated: entry.meditated,
  breakfast: entry.breakfast,
  lunch: entry.lunch,
  dinner: entry.dinner,
  problems_solved: entry.problemsSolved,
  study_hours: entry.studyHours,
  university_attended: entry.universityAttended,
  university_revised: entry.universityRevised,
  morning_fresh_up: entry.morningFreshUp,
  spiritual_practice: entry.spiritualPractice,
  discipline_check: entry.disciplineCheck,
  discipline_score: entry.disciplineScore,
  reflection_text: entry.reflectionText,
});

// Convert DailyEntry to Supabase update
const entryToUpdate = (entry: Partial<DailyEntry>): DailyEntryUpdate => {
  const update: DailyEntryUpdate = {};
  if (entry.sleepHours !== undefined) update.sleep_hours = entry.sleepHours;
  if (entry.exercised !== undefined) update.exercised = entry.exercised;
  if (entry.meditated !== undefined) update.meditated = entry.meditated;
  if (entry.breakfast !== undefined) update.breakfast = entry.breakfast;
  if (entry.lunch !== undefined) update.lunch = entry.lunch;
  if (entry.dinner !== undefined) update.dinner = entry.dinner;
  if (entry.problemsSolved !== undefined) update.problems_solved = entry.problemsSolved;
  if (entry.studyHours !== undefined) update.study_hours = entry.studyHours;
  if (entry.universityAttended !== undefined) update.university_attended = entry.universityAttended;
  if (entry.universityRevised !== undefined) update.university_revised = entry.universityRevised;
  if (entry.morningFreshUp !== undefined) update.morning_fresh_up = entry.morningFreshUp;
  if (entry.spiritualPractice !== undefined) update.spiritual_practice = entry.spiritualPractice;
  if (entry.disciplineCheck !== undefined) update.discipline_check = entry.disciplineCheck;
  if (entry.disciplineScore !== undefined) update.discipline_score = entry.disciplineScore;
  if (entry.reflectionText !== undefined) update.reflection_text = entry.reflectionText;
  return update;
};

export const useHabitData = () => {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Check if Supabase is configured and initialize
  useEffect(() => {
    const supabaseConfigured = isSupabaseConfigured();
    setUseSupabase(supabaseConfigured);
    
    if (supabaseConfigured) {
      loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
  }, []);

  // Load data from Supabase
  const loadFromSupabase = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        loadFromLocalStorage();
        return;
      }

      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading from Supabase:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
        return;
      }

      if (data) {
        const entriesMap: Record<string, DailyEntry> = {};
        data.forEach((row) => {
          entriesMap[row.date] = rowToEntry(row);
        });
        setEntries(entriesMap);
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate data structure
        if (typeof parsed === 'object' && parsed !== null) {
          setEntries(parsed);
        } else {
          console.warn('Invalid data structure in localStorage, resetting...');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      // Try to recover by clearing corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear corrupted localStorage:', e);
      }
    }
    setIsLoading(false);
  };

  // Save to localStorage with quota exceeded handling
  const saveToLocalStorage = useCallback((entry: DailyEntry) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      current[entry.date] = entry;
      const serialized = JSON.stringify(current);
      
      // Check if data is too large (localStorage limit is typically 5-10MB)
      if (serialized.length > 4 * 1024 * 1024) { // 4MB warning threshold
        console.warn('localStorage is getting large, consider using Supabase for better storage');
      }
      
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded. Please use Supabase or clear old data.');
        // Optionally: Keep only last 6 months of data
        try {
          const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          const cutoffDate = formatDate(sixMonthsAgo);
          
          const filtered: Record<string, DailyEntry> = {};
          Object.keys(current).forEach(date => {
            if (date >= cutoffDate) {
              filtered[date] = current[date];
            }
          });
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          console.info('Cleared data older than 6 months to free up space');
        } catch (cleanupError) {
          console.error('Failed to cleanup localStorage:', cleanupError);
        }
      } else {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, []);

  // Save data to Supabase or localStorage
  const saveEntry = useCallback(async (entry: DailyEntry) => {
    if (useSupabase) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const insertData = entryToInsert(entry);
          const { error } = await supabase
            .from('daily_entries')
            .upsert(insertData, { onConflict: 'date' });

          if (error) {
            console.error('Error saving to Supabase:', error);
            // Fallback to localStorage
            saveToLocalStorage(entry);
          }
        } catch (error) {
          console.error('Error saving to Supabase:', error);
          saveToLocalStorage(entry);
        }
      } else {
        saveToLocalStorage(entry);
      }
    } else {
      saveToLocalStorage(entry);
    }
  }, [useSupabase, saveToLocalStorage]);

  // Save data to localStorage (for fallback when not using Supabase)
  // Debounced to avoid excessive writes
  useEffect(() => {
    if (!isLoading && !useSupabase) {
      const timeoutId = setTimeout(() => {
        try {
          const serialized = JSON.stringify(entries);
          if (serialized.length > 4 * 1024 * 1024) {
            console.warn('localStorage data is large, consider using Supabase');
          }
          localStorage.setItem(STORAGE_KEY, serialized);
        } catch (error: any) {
          if (error?.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Please configure Supabase or clear old data.');
          }
        }
      }, 500); // Debounce by 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [entries, isLoading, useSupabase]);

  const getCurrentEntry = useCallback((): DailyEntry => {
    return entries[currentDate] || createEmptyEntry(currentDate);
  }, [entries, currentDate]);

  const updateEntry = useCallback((updates: Partial<DailyEntry>) => {
    setEntries(prev => {
      const current = prev[currentDate] || createEmptyEntry(currentDate);
      const updated = { ...current, ...updates };
      updated.disciplineScore = calculateDisciplineScore(updated);
      
      // Save to Supabase or localStorage (async, don't wait)
      saveEntry(updated);
      
      return { ...prev, [currentDate]: updated };
    });
  }, [currentDate, saveEntry]);

  const getEntry = useCallback((date: string): DailyEntry | null => {
    return entries[date] || null;
  }, [entries]);

  const getAllEntries = useCallback((): DailyEntry[] => {
    return Object.values(entries).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const getEntriesForRange = useCallback((startDate: string, endDate: string): DailyEntry[] => {
    return getAllEntries().filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );
  }, [getAllEntries]);

  const getWeekEntries = useCallback((): DailyEntry[] => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return getEntriesForRange(formatDate(weekAgo), formatDate(today));
  }, [getEntriesForRange]);

  const getMonthEntries = useCallback((): DailyEntry[] => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return getEntriesForRange(formatDate(monthAgo), formatDate(today));
  }, [getEntriesForRange]);

  return {
    currentDate,
    setCurrentDate,
    currentEntry: getCurrentEntry(),
    updateEntry,
    getEntry,
    getAllEntries,
    getWeekEntries,
    getMonthEntries,
    isLoading,
    useSupabase,
  };
};
