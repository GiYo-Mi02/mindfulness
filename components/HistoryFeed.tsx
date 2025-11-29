import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { MoodEntry, MOOD_EMOJIS, MOOD_COLORS } from '@/app/types';

interface HistoryFeedProps {
  entries: MoodEntry[];
  activeFilter: string | null;
  onTagFilter: (tag: string | null) => void;
  onDelete?: (id: string) => void;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export default function HistoryFeed({
  entries = [],
  activeFilter,
  onTagFilter,
  onDelete,
}: HistoryFeedProps) {
  const filteredEntries = activeFilter
    ? entries.filter(e => e.tags.includes(activeFilter))
    : entries;

  const sortedEntries = [...filteredEntries].sort((a, b) => b.timestamp - a.timestamp);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-slate-800 font-bold text-lg">Recent Journal</Text>
        {activeFilter && (
          <TouchableOpacity
            onPress={() => onTagFilter(null)}
            className="bg-slate-100 px-3 py-1 rounded-full"
          >
            <Text className="text-slate-600 text-sm">Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {sortedEntries.length === 0 ? (
        <View className="items-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <Text className="text-slate-400 text-sm">
            {activeFilter ? 'No entries with this tag' : 'No entries yet. Start tracking!'}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {sortedEntries.map((entry) => (
            <View
              key={entry.id}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  {/* Mood & Time */}
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text 
                      className={`text-sm font-bold ${
                        entry.mood >= 4 ? 'text-emerald-500' : 
                        entry.mood === 3 ? 'text-amber-500' : 'text-rose-500'
                      }`}
                    >
                      {MOOD_LABELS[entry.mood]}
                    </Text>
                    <Text className="text-slate-300">•</Text>
                    <Text className="text-xs text-slate-400">{formatTime(entry.timestamp)}</Text>
                  </View>

                  {/* Notes */}
                  <Text className="text-slate-600 text-sm" numberOfLines={2}>
                    {entry.notes || 'No note added.'}
                  </Text>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <View className="flex-row flex-wrap gap-1 mt-2">
                      {entry.tags.map(tag => (
                        <TouchableOpacity
                          key={tag}
                          onPress={() => onTagFilter(tag)}
                          className={`px-2 py-0.5 rounded-full ${
                            activeFilter === tag ? 'bg-indigo-500' : 'bg-slate-100'
                          }`}
                        >
                          <Text
                            className={`text-[10px] ${
                              activeFilter === tag ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Delete button */}
                {onDelete && (
                  <TouchableOpacity
                    onPress={() => onDelete(entry.id)}
                    className="p-2 ml-2 opacity-50"
                  >
                    <Trash2 size={16} color="#f43f5e" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
