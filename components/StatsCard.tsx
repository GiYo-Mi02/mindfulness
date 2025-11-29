import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Hash, Calendar } from 'lucide-react-native';
import { MoodEntry } from '@/types';

interface StatsCardProps {
  entries: MoodEntry[];
}

export default function StatsCard({ entries = [] }: StatsCardProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return { average: 0, total: 0, streak: 0 };
    }

    const average = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;

    // Calculate streak (consecutive days with entries)
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(now - i * dayMs);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = dayStart.getTime() + dayMs;
      
      const hasEntry = entries.some(
        e => e.timestamp >= dayStart.getTime() && e.timestamp < dayEnd
      );
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      average: Math.round(average * 10) / 10,
      total: entries.length,
      streak,
    };
  }, [entries]);

  return (
    <View className="flex-row gap-3">
      <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-1">
          <TrendingUp size={16} color="#6366f1" />
          <Text className="text-slate-500 text-xs ml-1">Avg Mood</Text>
        </View>
        <Text className="text-slate-700 text-2xl font-bold">
          {stats.average > 0 ? stats.average.toFixed(1) : '-'}
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-1">
          <Hash size={16} color="#10b981" />
          <Text className="text-slate-500 text-xs ml-1">Entries</Text>
        </View>
        <Text className="text-slate-700 text-2xl font-bold">{stats.total}</Text>
      </View>

      <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-1">
          <Calendar size={16} color="#f59e0b" />
          <Text className="text-slate-500 text-xs ml-1">Streak</Text>
        </View>
        <Text className="text-slate-700 text-2xl font-bold">{stats.streak}d</Text>
      </View>
    </View>
  );
}
