import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '@/types';

const STORAGE_KEY = 'mindful_moment_entries';

export function useLocalStorage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const entriesRef = useRef<MoodEntry[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
        entriesRef.current = parsed;
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = useCallback(async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const newEntries = [newEntry, ...entriesRef.current];
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
    return newEntry;
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    const newEntries = entriesRef.current.filter(e => e.id !== id);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  }, []);

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
  };
}
