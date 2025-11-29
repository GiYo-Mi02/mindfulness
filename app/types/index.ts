export interface MoodEntry {
  id: string;
  mood: number; // 1-5
  tags: string[];
  notes: string;
  timestamp: number;
}

export type ContextTag = 'Sleep' | 'Work' | 'Social' | 'Exercise' | 'Family' | 'Hobbies' | 'Food' | 'Health' | 'Weather';

export const CONTEXT_TAGS: ContextTag[] = ['Sleep', 'Work', 'Social', 'Exercise', 'Family', 'Hobbies', 'Food', 'Health', 'Weather'];

export const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const MOOD_COLORS: Record<number, string> = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#eab308', // yellow-500
  4: '#84cc16', // lime-500
  5: '#22c55e', // green-500
};
