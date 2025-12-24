import { useState, useEffect, useCallback } from 'react';
import { DailyEntry, createEmptyEntry, calculateDisciplineScore, formatDate } from '@/types/habits';

const STORAGE_KEY = 'discipline-os-2026';

export const useHabitData = () => {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const getCurrentEntry = useCallback((): DailyEntry => {
    return entries[currentDate] || createEmptyEntry(currentDate);
  }, [entries, currentDate]);

  const updateEntry = useCallback((updates: Partial<DailyEntry>) => {
    setEntries(prev => {
      const current = prev[currentDate] || createEmptyEntry(currentDate);
      const updated = { ...current, ...updates };
      updated.disciplineScore = calculateDisciplineScore(updated);
      return { ...prev, [currentDate]: updated };
    });
  }, [currentDate]);

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
  };
};
